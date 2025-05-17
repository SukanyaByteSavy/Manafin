# Personal Finance Manager

A simple yet elegant personal finance management web application developed by Sukanya Patnaik from CV Raman Global University.

## Features

- Track your income and expenses easily
- Visualize your spending with interactive charts
- Filter transactions by type and month
- Responsive design works on desktop and mobile devices
- Data is stored locally in your browser

## Technologies Used

- HTML5
- CSS3 (with modern flexbox and grid layouts)
- JavaScript (vanilla, no frameworks)
- Chart.js for data visualization
- Font Awesome for icons
- LocalStorage for data persistence

## Getting Started

### Local Development

1. Open `index.html` in your web browser
2. Add your income and expenses using the form
3. View your financial summary and transaction history
4. Filter transactions as needed

### Using Docker

You can run this application anywhere using Docker:

1. Make sure you have Docker installed on your system
2. Clone or download this repository
3. Open a terminal and navigate to the project directory
4. Build the Docker image:
   ```
   docker build -t finance-manager .
   ```
5. Run the Docker container:
   ```
   docker run -p 8080:80 finance-manager
   ```
6. Open your browser and navigate to `http://localhost:8080`

### Docker Compose (Optional)

You can also use Docker Compose for easier management:

1. Create a `docker-compose.yml` file in the project directory (already provided)
2. Run:
   ```
   docker-compose up
   ```
3. Access the application at `http://localhost:8080`

## Privacy

All your financial data is stored locally in your browser using localStorage. No data is sent to any server.

## Developer

Developed by Sukanya Patnaik from CV Raman Global University.

## Deployment

This application can be deployed to any web server or cloud service that supports Docker containers:

- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service
- Heroku
- DigitalOcean App Platform

Simply build and push the Docker image to your preferred service.

## License

This project is open source and available for personal and educational use.
