import requests
import json

url = "https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=10000"

headers = {
    "User-Agent": "Mozilla/5.0"
}

print("Fetching ticker list from NASDAQ...")
response = requests.get(url, headers=headers)
data = response.json()

rows = data["data"]["table"]["rows"]

tickers = [
    {
        "symbol": row["symbol"],
        "name": row["name"]
    }
    for row in rows
]

with open("tickers.json", "w") as f:
    json.dump(tickers, f, indent=2)

print(f"Saved {len(tickers)} tickers to tickers.json")