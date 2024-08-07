import pandas as pd
import os

data_directory = "D:/GitClone/TA18/Onboarding_Project/dev/frontend/WPData"

accidents_df = pd.read_csv(os.path.join(data_directory, "ACCIDENT.csv"))
locations_df = pd.read_csv(os.path.join(data_directory, "ACCIDENT_LOCATION.csv"))
vehicles_df = pd.read_csv(os.path.join(data_directory, "VEHICLE.csv"))
postcode_to_region = pd.read_csv(os.path.join(data_directory, "postcode_to_region.csv"))

bicycle_accidents = vehicles_df[vehicles_df["VEHICLE_TYPE"] == 13]

merged_df = bicycle_accidents.merge(accidents_df, on="ACCIDENT_NO")
merged_df = merged_df.merge(locations_df, on="ACCIDENT_NO")
merged_df = merged_df.merge(
    postcode_to_region, left_on="POSTCODE_CRASH", right_on="Postcode", how="left"
)

all_columns = merged_df.columns.tolist()

key_columns = [
    col
    for col in [
        "ACCIDENT_NO",
        "ACCIDENT_DATE",
        "ACCIDENT_TIME",
        "DAY_OF_WEEK",
        "NODE_ID",
        "NODE_TYPE",
        "LGA_NAME",
        "POSTCODE_CRASH",
        "VEHICLE_ID",
        "VEHICLE_TYPE",
        "DRIVER_AGE",
        "DRIVER_SEX",
        "Place_Name",
        "LATITUDE",
        "LONGITUDE",
    ]
    if col in all_columns
]

final_df = merged_df[key_columns]

output_path = os.path.join(
    data_directory, "merged_bicycle_accidents_key_columns_with_coordinates.csv"
)
final_df.to_csv(output_path, index=False)
