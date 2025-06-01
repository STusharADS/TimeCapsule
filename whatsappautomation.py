import pywhatkit
from datetime import datetime
import time
import pandas as pd

def send_whatsapp_message(phone_number, message, date_str, time_str):
    dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    now = datetime.now()

    wait_seconds = (dt - now).total_seconds()
    if wait_seconds <= 0:
        print(f"Skipping {phone_number} — scheduled time is in the past.")
        return

    print(f"⏳ Waiting {int(wait_seconds)} seconds to send message to {phone_number}...")
    time.sleep(max(wait_seconds - 20, 0))  # ensure sleep isn't negative

    try:
        pywhatkit.sendwhatmsg(
            phone_no=phone_number,
            message=message,
            time_hour=dt.hour,
            time_min=dt.minute,
            wait_time=20
        )
        print(f"Message to {phone_number} scheduled at {dt.strftime('%H:%M')}!")
    except Exception as e:
        print(f"Failed to send to {phone_number}: {e}")

# Load CSV file
df = pd.read_csv("scheduledWhatsappMessages.csv")

# Loop through each row
for index, row in df.iterrows():
    datetime_str = str(row["DateTime"])
    date_str = datetime_str.split()[0]
    time_str = datetime_str.split()[1][:5]
    phone_number = str(row["Phone Number"])
    if not phone_number.startswith("+"):
        phone_number = "+" + phone_number

    message = str(row["Message"])

    send_whatsapp_message(phone_number, message, date_str, time_str)