import argparse
import json
import pandas as pd
import joblib
import numpy as np
import sys
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder

# Ensure necessary NLTK resources are downloaded
nltk.download('stopwords')

# Define the required features for quality evaluation
required_features = [
    'missing_values', 'duplicate_rows', 'unique_values', 'mixed_data_types',
    'valid_range_values', 'outliers', 'class_balance', 'data_type_consistency'
]

# Step 1: Load malicious words from "vulger.txt" file
def load_malicious_words(file_path='vulger.txt'):
    """Load malicious words from the file into a list."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            malicious_words = file.read().splitlines()
        return malicious_words
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return []

# Step 2: Clean the text (remove punctuation and convert to lowercase)
def clean_text(text):
    """Remove punctuation, special characters, and convert to lowercase."""
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = text.lower()  # Convert text to lowercase
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text

# Step 3: Tokenize the text into words
def tokenize_text(text_data):
    """Tokenize each line of text into words."""
    cleaned_data = [clean_text(text) for text in text_data]  # Clean text
    tokenized_data = [text.split() for text in cleaned_data]  # Tokenize each line
    return tokenized_data

# Step 4: Remove stopwords
def remove_stopwords(tokenized_data):
    """Remove common stopwords from the tokenized text."""
    stop_words = set(stopwords.words('english'))
    return [[word for word in tokens if word not in stop_words] for tokens in tokenized_data]

# Step 5: Stemming (optional)
def stem_tokens(tokenized_data):
    """Apply stemming to each token."""
    stemmer = PorterStemmer()
    return [[stemmer.stem(word) for word in tokens] for tokens in tokenized_data]

# Step 6: Detect malicious words in the text
def detect_malicious_words_in_text(tokenized_data, malicious_words):
    """Detect malicious words in the tokenized text."""
    malicious_word_count = 0
    for tokens in tokenized_data:
        malicious_word_count += sum(1 for word in tokens if word in malicious_words)
    return malicious_word_count

# Load pre-trained model for quality scoring (for dataset processing)
def load_model(filename='dataset_quality_model_xgb.pkl'):
    """Load the pre-trained model."""
    try:
        return joblib.load(filename)
    except FileNotFoundError:
        print(f"Error: The model file {filename} was not found.")
        return None

# Predict the quality score (using pre-trained model)
def predict_quality_score(model, metrics):
    """Predict the quality score."""
    metrics_reshaped = np.array(metrics).reshape(1, -1)  # Ensure 1 sample with 8 features
    quality_score = model.predict(metrics_reshaped)
    return quality_score[0]

# Calculate dataset quality metrics (for dataset CSV)
def calculate_quality_metrics(df):
    quality_metrics = {}

    # Percentage of missing values
    quality_metrics['missing_values'] = df.isnull().mean().mean() * 100

    # Percentage of duplicate rows
    quality_metrics['duplicate_rows'] = df.duplicated().mean() * 100

    # Average unique values per column
    quality_metrics['unique_values'] = df.nunique().mean() / df.shape[0] * 100

    # Percentage of columns with mixed data types
    def mixed_data_type_percentage(series):
        return series.apply(type).nunique() > 1

    quality_metrics['mixed_data_types'] = df.apply(mixed_data_type_percentage).mean() * 100

    # Proportion of numerical values within a valid range (0-100 as an example)
    def within_valid_range(series, min_val=0, max_val=100):
        return ((series >= min_val) & (series <= max_val)).mean() * 100

    if df.select_dtypes(include=[np.number]).shape[1] > 0:
        quality_metrics['valid_range_values'] = df.select_dtypes(include=[np.number]).apply(within_valid_range).mean()

    # Proportion of outliers using IQR method
    def calculate_outliers(series):
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        return ((series < lower_bound) | (series > upper_bound)).mean() * 100

    if df.select_dtypes(include=[np.number]).shape[1] > 0:
        quality_metrics['outliers'] = df.select_dtypes(include=[np.number]).apply(calculate_outliers).mean()

    # Distribution balance (for classification problems, balance of class distributions)
    if 'target' in df.columns:
        quality_metrics['class_balance'] = df['target'].value_counts(normalize=True).std() * 100

    # Data type consistency
    def data_type_consistency(series):
        return series.apply(type).value_counts(normalize=True).max() * 100

    quality_metrics['data_type_consistency'] = df.apply(data_type_consistency).mean()

    # Ensure we have exactly the required features
    quality_metrics = {key: quality_metrics.get(key, 0) for key in required_features}

    return quality_metrics

# Detect malicious words in the dataset (for CSV datasets)
def detect_malicious_words(df, malicious_words):
    malicious_count = 0
    # Iterate over each column in the dataset
    for column in df.columns:
        if df[column].dtype == 'object':  # Check if the column is of string type
            for value in df[column].astype(str):  # Convert to string if not already
                # Clean the value: convert to lowercase, remove punctuation, strip spaces
                cleaned_value = re.sub(r'[^\w\s]', '', value.lower()).strip()  # Clean value
                
                # Check for malicious words in the cleaned value (partial matches allowed)
                if any(malicious_word in cleaned_value for malicious_word in malicious_words):
                    print(f"Found malicious word in: '{cleaned_value}'")  # Debugging line
                    malicious_count += 1
    return malicious_count

# Function to process and evaluate the text file (for text file analysis)
def process_and_evaluate_text(file_path, malicious_words):
    """Process the text file and evaluate the presence of malicious words."""
    text_data = load_text_data(file_path)
    if text_data is None:
        return {'status': 'error', 'message': 'Text file not found.'}

    tokenized_data = tokenize_text(text_data)  # Tokenize the text
    tokenized_data = remove_stopwords(tokenized_data)  # Remove stopwords
    tokenized_data = stem_tokens(tokenized_data)  # Apply stemming
    malicious_word_count = detect_malicious_words_in_text(tokenized_data, malicious_words)  # Detect malicious words

    # Return result
    result = {
        'total_malicious_words': malicious_word_count,
        'processed_data_sample': tokenized_data[:5]  # Show sample of processed data (first 5 lines)
    }

    return result

# Anomaly detection using IsolationForest
def preprocess_data(dataset):
    """Preprocess the dataset to convert categorical data to numeric."""
    # Identify categorical columns
    categorical_cols = dataset.select_dtypes(include=['object']).columns

    # Apply Label Encoding for categorical columns
    label_encoder = LabelEncoder()
    for col in categorical_cols:
        dataset[col] = label_encoder.fit_transform(dataset[col].astype(str))

    return dataset

def detect_anomalies(dataset):
    # Preprocess the dataset to handle categorical data
    dataset = preprocess_data(dataset)

    # Now apply IsolationForest
    model = IsolationForest(contamination=0.1)  # Adjust contamination rate based on your use case
    model.fit(dataset)
    dataset['anomaly'] = model.predict(dataset)
    anomalies = dataset[dataset['anomaly'] == -1]
    return anomalies

# Data quality checks
def data_quality_checks(dataset):
    missing_values = dataset.isnull().sum()
    duplicates = dataset.duplicated().sum()
    data_types = dataset.dtypes.apply(lambda x: str(x))
    return missing_values.to_dict(), duplicates, data_types.to_dict()

# Schema validation
def validate_schema(dataset, expected_schema):
    columns_match = set(dataset.columns) == set(expected_schema.keys())
    data_types_match = all(dataset[column].dtype == expected_schema[column] for column in expected_schema)
    return columns_match and data_types_match

# Evaluate quality score for CSV or text file, including anomaly detection
def evaluate_quality_score(dataset_file, malicious_words):
    """Evaluate the dataset file quality, detect malicious words, and perform anomaly detection."""
    try:
        df = pd.read_csv(dataset_file)
    except FileNotFoundError:
        print(f"Error: The file {dataset_file} was not found.")
        return None

    # Calculate dataset quality metrics
    quality_metrics = calculate_quality_metrics(df)
    print(f"Calculated quality metrics: {quality_metrics}")

    # Predict the quality score
    model = load_model()
    if model is not None:
        quality_score = predict_quality_score(model, list(quality_metrics.values()))
        print(f"Predicted quality score: {quality_score}")
    else:
        print("Model not loaded. Unable to predict quality score.")
    
    # Detect malicious words
    malicious_word_count = detect_malicious_words(df, malicious_words)
    print(f"Found {malicious_word_count} instances of malicious words.")

    # Anomaly detection
    anomalies = detect_anomalies(df)
    if not anomalies.empty:
        print(f"Detected {len(anomalies)} anomalies in the dataset.")
        print(anomalies)
    else:
        print("No anomalies detected in the dataset.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate dataset quality and detect malicious content.")
    parser.add_argument("dataset_file", help="Path to the dataset file (CSV format).")
    args = parser.parse_args()

    malicious_words = load_malicious_words()  # Load malicious words from the file

    # Evaluate the dataset file
    evaluate_quality_score(args.dataset_file, malicious_words)

