# Firefly Finder

A full-stack web application for tracking and sharing firefly sightings. This project combines the beauty of bioluminescent insects with modern web technology to create an interactive platform for nature enthusiasts.

## Features

- Interactive map interface for viewing firefly sightings using Google Maps API
- User authentication and profile management with session-based login
- Ability to add, edit, and delete personal sightings with location tracking
- Integration with iNaturalist API for additional firefly observations
- Friend system for connecting with other firefly enthusiasts
- Species database with detailed information about different types of fireflies
- Responsive design for both desktop and mobile viewing
- Photo upload support for sightings with static file serving
- Location-based sighting tracking with coordinates and radius search
- User profiles with customizable profile pictures
- Progress tracking and ranking system for users
- Real-time friend search and management

## Tech Stack

### Frontend

- React.js 18.2.0
- Google Maps API with @react-google-maps/api
- CSS3 with custom styling and CSS variables
- React Router v6 for navigation
- Axios for API requests
- Custom React hooks for state management (useInaturalistData)
- iNaturalist API integration for firefly observations

### Backend

- Flask with Flask-RESTful for API endpoints
- SQLAlchemy with Flask-SQLAlchemy for ORM
- Flask-Migrate for database migrations
- Flask-CORS for cross-origin requests
- Flask-Bcrypt for password hashing
- PostgreSQL database
- SQLAlchemy-Serializer for JSON serialization
- Werkzeug for file uploads and static file serving

## Getting Started

### Prerequisites

- Python 3.8.x
- Node.js and npm
- PostgreSQL
- Google Maps API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ThisbeSchoJo/firefly-finder.git
cd firefly-finder
```

2. Set up the backend:

```bash
cd server
pipenv install
pipenv shell
flask db init
flask db migrate
flask db upgrade
python seed.py
```

3. Set up the frontend:

```bash
cd ../client
npm install
```

4. Start the servers:

```bash
# Terminal 1 (backend)
cd server
python app.py

# Terminal 2 (frontend)
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
firefly-finder/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── App.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Profile.js
│   │   │   ├── Map.js
│   │   │   ├── Sighting.js
│   │   │   ├── SightingList.js
│   │   │   ├── AddSightingForm.js
│   │   │   ├── EditSightingForm.js
│   │   │   ├── AddFriendForm.js
│   │   │   ├── FriendProfile.js
│   │   │   ├── NavBar.js
│   │   │   ├── ObservationPopup.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ErrorPage.js
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useInaturalistData.js
│   │   ├── services/      # API services
│   │   │   └── inaturalistApi.js
│   │   ├── routes.js      # Route definitions
│   │   └── *.css          # Component-specific styles
│   └── package.json
├── server/                # Flask backend
│   ├── app.py            # Main Flask application
│   ├── config.py         # Flask configuration
│   ├── models.py         # Database models
│   ├── seed.py           # Database seeding script
│   ├── migrations/       # Database migration files
│   └── static/uploads/   # Uploaded files
├── Pipfile               # Python dependencies
├── requirements.txt      # Alternative Python dependencies
└── README.md
```

## API Endpoints

### Authentication

- `POST /signup` - Create new user account
- `POST /login` - User login
- `DELETE /logout` - User logout
- `GET /check_session` - Check current session

### Sightings

- `GET /sightings` - Get all sightings (with optional location filtering)
- `POST /sightings` - Create new sighting
- `GET /sightings/<id>` - Get specific sighting
- `PATCH /sightings/<id>` - Update sighting
- `DELETE /sightings/<id>` - Delete sighting
- `GET /sightings/count` - Get user's sighting count

### User Management

- `GET /profile/<user_id>` - Get user profile
- `GET /friend-search` - Search for users to add as friends
- `POST /add-friend` - Add a friend
- `GET /friends` - Get user's friends list
- `DELETE /remove-friend/<friend_id>` - Remove a friend

### Species

- `GET /species` - Get all firefly species

## Usage

1. Create an account or log in
2. View the map to see firefly sightings in your area
3. Add your own sightings by clicking on the map
4. Upload photos and add descriptions to your sightings
5. Connect with other users through the friend system
6. Browse the species database to learn about different types of fireflies
7. Customize your profile with a profile picture
8. Track your progress and ranking in the community

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Learning Goals

- Discuss the basic directory structure of a full-stack Flask/React application.
- Carry out the first steps in creating your Phase 4 project.

---

## Introduction

Fork and clone this lesson for a template for your full-stack application. Take
a look at the directory structure before we begin (NOTE: node_modules will be
generated in a subsequent step):

```console
$ tree -L 2
$ # the -L argument limits the depth at which we look into the directory structure
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── README.md
│   ├── package.json
│   ├── public
│   └── src
└── server
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
```

A `migrations` folder will be added to the `server` directory in a later step.

The `client` folder contains a basic React application, while the `server`
folder contains a basic Flask application. You will adapt both folders to
implement the code for your project .

NOTE: If you did not previously install `tree` in your environment setup, MacOS
users can install this with the command `brew install tree`. WSL and Linux users
can run `sudo apt-get install tree` to download it as well.

## Where Do I Start?

Just as with your Phase 3 Project, this will likely be one of the biggest
projects you've undertaken so far. Your first task should be creating a Git
repository to keep track of your work and roll back any undesired changes.

### Removing Existing Git Configuration

If you're using this template, start off by removing the existing metadata for
Github and Canvas. Run the following command to carry this out:

```console
$ rm -rf .git .canvas
```

The `rm` command removes files from your computer's memory. The `-r` flag tells
the console to remove _recursively_, which allows the command to remove
directories and the files within them. `-f` removes them permanently.

`.git` contains this directory's configuration to track changes and push to
Github (you want to track and push _your own_ changes instead), and `.canvas`
contains the metadata to create a Canvas page from your Git repo. You don't have
the permissions to edit our Canvas course, so it's not worth keeping around.

### Creating Your Own Git Repo

After removing the existing Git configuration, you'll want to create your own
Git repository. Run the following command:

```console
$ git init
```

This will create a new Git repository in your current directory. You can then
add your files and make your first commit:

```console
$ git add .
$ git commit -m "Initial commit"
```

### Setting Up Your Remote Repository

You'll also want to create a remote repository on Github to store your code.
You can do this by:

1. Going to [Github.com](https://github.com)
2. Clicking the "+" icon in the top right corner
3. Selecting "New repository"
4. Giving your repository a name
5. Making sure it's public
6. **NOT** initializing it with a README, .gitignore, or license (since you
   already have these files)

Once you've created your remote repository, you can connect your local
repository to it:

```console
$ git remote add origin <your-repository-url>
$ git branch -M main
$ git push -u origin main
```

### Installing Dependencies

Now you'll need to install the dependencies for both the frontend and backend.
Start with the backend:

```console
$ cd server
$ pipenv install
$ pipenv shell
```

This will install all the Python dependencies listed in the `Pipfile`. You can
then install the frontend dependencies:

```console
$ cd ../client
$ npm install
```

This will install all the JavaScript dependencies listed in the `package.json`
file.

### Running Your Application

Once you've installed all the dependencies, you can run your application. You'll
need to run both the frontend and backend servers. You can do this by opening
two terminal windows and running the following commands:

**Terminal 1 (Backend):**

```console
$ cd server
$ pipenv shell
$ python app.py
```

**Terminal 2 (Frontend):**

```console
$ cd client
$ npm start
```

Your application should now be running at `http://localhost:3000`.

### Database Setup

You'll also need to set up your database. You can do this by running the
following commands:

```console
$ cd server
$ pipenv shell
$ flask db init
$ flask db migrate
$ flask db upgrade
$ python seed.py
```

This will create your database and populate it with some initial data.

### Next Steps

Now that you have your application running, you can start building your features.
You can:

1. Add new routes to your Flask backend
2. Create new React components
3. Add new features to your application
4. Style your application with CSS
5. Add new dependencies as needed

Remember to commit your changes regularly:

```console
$ git add .
$ git commit -m "Add new feature"
$ git push
```

This will help you keep track of your progress and make it easy to roll back
changes if something goes wrong.
