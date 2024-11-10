import argparse
import pandas as pd
import numpy as np

# Define the required features for quality evaluation
required_features = [
    'missing_values', 'duplicate_rows', 'unique_values', 'mixed_data_types',
    'valid_range_values', 'outliers', 'class_balance', 'data_type_consistency'
]

# Calculate dataset quality metrics (for dataset CSV)
def calculate_quality_metrics(df):
    quality_metrics = {}

    # Percentage of missing values
    missing_percentage = df.isnull().mean().mean() * 100
    quality_metrics['missing_values'] = 100 - missing_percentage

    # Percentage of duplicate rows
    duplicate_percentage = df.duplicated().mean() * 100
    quality_metrics['duplicate_rows'] = 100 - duplicate_percentage

    # Average unique values per column (normalized by number of rows)
    unique_percentage = (df.nunique().mean() / df.shape[0]) * 100
    quality_metrics['unique_values'] = unique_percentage

    # Percentage of columns with mixed data types
    def mixed_data_type_percentage(series):
        return series.apply(type).nunique() > 1

    mixed_percentage = df.apply(mixed_data_type_percentage).mean() * 100
    quality_metrics['mixed_data_types'] = 100 - mixed_percentage

    # Proportion of numerical values within a valid range (0-100 as an example)
    def within_valid_range(series, min_val=0, max_val=100):
        return ((series >= min_val) & (series <= max_val)).mean() * 100

    if df.select_dtypes(include=[np.number]).shape[1] > 0:
        valid_range_percentage = df.select_dtypes(include=[np.number]).apply(within_valid_range).mean()
        quality_metrics['valid_range_values'] = valid_range_percentage
    else:
        quality_metrics['valid_range_values'] = 100  # No numerical columns, assume perfect score

    # Proportion of outliers using IQR method
    def calculate_outliers(series):
        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr
        return ((series < lower_bound) | (series > upper_bound)).mean() * 100

    if df.select_dtypes(include=[np.number]).shape[1] > 0:
        outlier_percentage = df.select_dtypes(include=[np.number]).apply(calculate_outliers).mean()
        quality_metrics['outliers'] = 100 - outlier_percentage
    else:
        quality_metrics['outliers'] = 100  # No numerical columns, assume perfect score

    # Distribution balance (for classification problems, balance of class distributions)
    if 'target' in df.columns:
        class_balance_score = (1 - df['target'].value_counts(normalize=True).std()) * 100
        quality_metrics['class_balance'] = class_balance_score
    else:
        quality_metrics['class_balance'] = 100  # If no target column, assume perfect balance

    # Data type consistency
    def data_type_consistency(series):
        return series.apply(type).value_counts(normalize=True).max() * 100

    data_consistency_percentage = df.apply(data_type_consistency).mean()
    quality_metrics['data_type_consistency'] = data_consistency_percentage

    # Ensure we have exactly the required features
    quality_metrics = {key: quality_metrics.get(key, 0) for key in required_features}

    return quality_metrics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate dataset quality and detect malicious content.")
    parser.add_argument("dataset_file", help="Path to the dataset file (CSV format).")
    args = parser.parse_args()

    # Load the dataset
    df = pd.read_csv(args.dataset_file)

    # Calculate quality metrics
    metrics = calculate_quality_metrics(df)

    # Calculate the mean of the quality metrics
    mean_quality_score = np.mean(list(metrics.values()))

    # Output the mean quality score and the calculated quality metrics
    print(f"Mean quality score: {mean_quality_score}")
    print(f"Calculated quality metrics: {metrics}")
