# HostMe

A full-stack web application that replicates core features of Airbnb, built with React and Symfony.

## Technologies Used

### Frontend
- React
- Tailwind CSS

### Backend
- Symfony 7
- PHP 8
- PotsgreSQL
- Doctrine ORM
- JWT Authentication

## Getting Started

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js (18.x or higher)
- PostgresSQL 16/17

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/react-symfony-airbnb-clone.git
cd react-symfony-airbnb-clone
```

2. Backend Setup
```bash
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start
```

3. Frontend Setup
```bash
npm install
npm run watch
```

## Environment Variables

Create or edit the `.env` file with the necessary values
