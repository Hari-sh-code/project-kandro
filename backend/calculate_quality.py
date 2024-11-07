import pandas as pd
import joblib
import numpy as np
import json
import sys

required_features = [
    'missing_values', 'duplicate_rows', 'unique_values', 'mixed_data_types', 
    'valid_range_values', 'outliers', 'class_balance', 'data_type_consistency'
]

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

    # Correlation with target variable (if target column exists)
    if 'target' in df.columns and df['target'].dtype in [np.int64, np.float64]:
        correlations = df.corr()['target'].drop('target')
        quality_metrics['correlation_with_target'] = correlations.abs().mean() * 100

    # Cardinality of categorical columns
    categorical_columns = df.select_dtypes(include=['object']).columns
    if len(categorical_columns) > 0:
        quality_metrics['categorical_cardinality'] = df[categorical_columns].nunique().mean() * 100

    # Ensure we have exactly the required features
    quality_metrics = {key: quality_metrics.get(key, 0) for key in required_features}

    return quality_metrics

def load_model(filename='dataset_quality_model_xgb.pkl'):
    """Load the pre-trained model."""
    try:
        return joblib.load(filename)
    except FileNotFoundError:
        print(f"Error: The model file {filename} was not found.")
        return None

def predict_quality_score(model, df):
    """Predict the quality score."""
    metrics = calculate_quality_metrics(df)
    feature_vector = list(metrics.values())
    quality_score = model.predict([feature_vector])
    return quality_score[0]

def evaluate_quality_score(file_path):
    """Load dataset, make prediction, and return quality score."""
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        return None

    model = load_model()
    if model is None:
        return None

    quality_score = predict_quality_score(model, df)
    return quality_score

# Main function to be executed when called from Node.js
def main():
    # Get the file path passed from Node.js (frontend)
    file_path = sys.argv[1]  # Read file path from command line arguments
    quality_score = evaluate_quality_score(file_path)
    
    if quality_score is not None:
        result = {
            'status': 'success',
            'quality_score': round(float(quality_score), 2)  # Ensure it's a native float
        }
    else:
        result = {
            'status': 'error',
            'message': 'Could not calculate quality score.'
        }

    # Print the result as JSON so Node.js can capture it
    print(json.dumps(result))

if __name__ == "__main__":
    main()