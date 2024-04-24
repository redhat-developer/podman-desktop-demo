# Flask Frontend Application

This is a simple front-end application built with Flask and Redis. It demonstrates how to create a web application that interacts with a Redis cache to store and retrieve data.

## Features

- Simple web interface powered by Flask
- Integration with Redis for caching and data persistence
- Increments a counter on each page visit and displays the count
- Dockerfile for easy containerization

## Prerequisites

- Python 3.x
- Redis server
- Podman (optional, for containerization)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/podman-desktop-demo
```

2. Change to the project directory:
```bash
cd primary-podify-demo/front
```

3. Install the required dependencies:
```bash
pip install -r requirements.txt
```

4. Make sure Redis server is running on the default port (6379).

## Usage

1. Start the Flask application:
```bash
python app.py
```
2. Open a web browser and navigate to http://localhost:5000.
3. You should see the frontend application displaying the number of times the page has been visited.
4. Refresh the page to increment the counter.

## Containerization

The application can be containerized using Podman. A Dockerfile is provided to build the container image.
1. To build the container image:
```bash
docker build -t python-frontend .
```
2. To run the container:
```bash
docker run -p 5000:5000 python-frontend
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
