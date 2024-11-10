import pandas as pd
import joblib
import numpy as np
import json
import sys
from sklearn.ensemble import IsolationForest
from pyod.models.knn import KNN
from sklearn.preprocessing import StandardScaler

# Define the required features for quality evaluation
required_features = [
    'missing_values', 'duplicate_rows', 'unique_values', 'mixed_data_types', 
    'valid_range_values', 'outliers', 'class_balance', 'data_type_consistency'
]

# Step 3: Calculate dataset quality metrics
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

# Load pre-trained model
def load_model(filename='dataset_quality_model_xgb.pkl'):
    """Load the pre-trained model."""
    try:
        return joblib.load(filename)
    except FileNotFoundError:
        print(f"Error: The model file {filename} was not found.")
        return None

# Predict the quality score
def predict_quality_score(model, df):
    """Predict the quality score."""
    metrics = calculate_quality_metrics(df)
    feature_vector = list(metrics.values())
    quality_score = model.predict([feature_vector])
    return quality_score[0]

# Malicious Data and Fake Dataset Detection
def detect_anomalies_and_fake_data(df):
    # Select only numeric columns for scaling
    numeric_columns = df.select_dtypes(include=[np.number]).columns

    # If there are no numeric columns, raise an exception
    if numeric_columns.empty:
        raise ValueError("The dataset must contain numeric columns for scaling.")

    # Scaling the numeric data for better performance in anomaly detection
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[numeric_columns])

    # Apply Isolation Forest for malicious detection (Anomaly Detection)
    isolation_forest = IsolationForest(contamination=0.1)
    isolation_forest.fit(scaled_data)
    predictions_if = isolation_forest.predict(scaled_data)

    # Get the indices of the malicious data (anomalies)
    malicious_indices = np.where(predictions_if == -1)[0]  # -1 indicates anomaly (malicious data)

    # If 10% or more of the data is malicious, set malicious data to False
    if len(malicious_indices) >= 0.01 * len(df):
        return [], False  # No malicious data if 10% or more are flagged

    # Apply KNN for fake dataset detection (Outlier detection)
    clf_knn = KNN()
    clf_knn.fit(scaled_data)
    predictions_knn = clf_knn.predict(scaled_data)

    # Fake dataset detection (checking for duplicates)
    duplicates = df.duplicated().any()  # True if any duplicate is found

    # Return malicious data indices and fake data detection result
    return malicious_indices.tolist(), not duplicates  # True if no duplicate is found

# Evaluate quality score for the uploaded dataset file
def evaluate_quality_score(file_path):
    """Load dataset, make prediction, and return quality score."""
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        return {'status': 'error', 'message': 'Dataset file not found.'}

    model = load_model()
    if model is None:
        return {'status': 'error', 'message': 'Model not found.'}

    # Step 3: Detect anomalies (malicious) and fake data
    malicious_indices, fake_data_found = detect_anomalies_and_fake_data(df)

    # Step 4: Predict the quality score
    quality_score = predict_quality_score(model, df)

    # Combine results and add malicious data indices
    result = {
        'status': 'success',
        'quality_score': round(float(quality_score), 2),
        'malicious_data_found': bool(len(malicious_indices) > 0),  # True if anomalies are found
        'malicious_data_indices': malicious_indices,  # List of indices where anomalies are found
        'fake_data_found': bool(fake_data_found)  # True if any duplicate is found
    }

    return result

# Main function to be executed when called from Node.js
def main():
    # Get the file path passed from Node.js (frontend)
    file_path = sys.argv[1]  # Read file path from command line arguments
    result = evaluate_quality_score(file_path)

    # Return the result as JSON
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    main()