import os
import pandas as pd

# Print current working directory
print("Current working directory:", os.getcwd())

# Change working directory to the correct path if necessary
os.chdir("D:/GitClone/TA18/Onboarding_Project/dev/frontend")

# Confirm the change
print("Updated working directory:", os.getcwd())

# Step 1: Read the TXT file and convert it to DataFrame using relative path
file_path = "WPData/AU.txt"

if os.path.exists(file_path):
    # Read the first few lines to inspect the data format
    print("Inspecting file content:")
    with open(file_path, "r") as file:
        for _ in range(5):
            print(file.readline())

    # Use sep='\t' to handle tab-delimited text file
    try:
        postcode_data = pd.read_csv(file_path, sep="\t", header=None)
        print(f"Total rows read: {len(postcode_data)}")
        print(postcode_data.head())

        # Check for columns length match
        expected_columns = [
            "Country",
            "Postcode",
            "Place_Name",
            "Admin_Name1",
            "Admin_Code1",
            "Admin_Name2",
            "Admin_Code2",
            "Admin_Name3",
            "Admin_Code3",
            "Latitude",
            "Longitude",
            "Accuracy",
        ]
        if len(postcode_data.columns) == len(expected_columns):
            postcode_data.columns = expected_columns
        else:
            print(
                f"Column mismatch. Expected {len(expected_columns)} columns but got {len(postcode_data.columns)}"
            )
            print("Data preview:")
            print(postcode_data.head())

        # Step 2: Extract the necessary columns: Postcode and Place_Name (used as Region)
        postcode_to_region = postcode_data[["Postcode", "Place_Name"]].drop_duplicates()
        print(f"Total unique rows after dropping duplicates: {len(postcode_to_region)}")

        # Step 3: Save the result as a CSV file
        output_path = "WPData/postcode_to_region.csv"
        postcode_to_region.to_csv(output_path, index=False)
        print(f"Data saved to {output_path}")

        # Display the dataframe
        print(postcode_to_region.head())
    except Exception as e:
        print(f"Error processing file: {e}")
else:
    print(f"File not found: {file_path}")
