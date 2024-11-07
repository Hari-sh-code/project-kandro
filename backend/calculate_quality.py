import sys
import pandas as pd
import joblib

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

    return quality_metrics

def load_model(filename='dataset_quality_model.pkl'):
    return joblib.load(filename)

def predict_quality_score(model, df):
    metrics = calculate_quality_metrics(df)
    quality_score = model.predict([list(metrics.values())])
    return quality_score[0]

def main():
    file_path = sys.argv[1]
    df = pd.read_csv(file_path)
    model = load_model()
    quality_score = predict_quality_score(model, df)
    return quality_score

if __name__ == "_main_":
    result = main()
    print(result)