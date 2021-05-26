## DEMO 

https://user-images.githubusercontent.com/43677925/119716250-8fa65280-be82-11eb-93a5-c39b6486f461.mp4


## CLONE REPOSITORY
```
git clone  https://github.com/Anurag-Chitnis/Note.ME.git
```
## INSTALL DEPENDENCIES
```
cd Note.Me
cd Notestaker
npm install
```
## TO RUN APPLICATION
```
npm start
```
## NAVIGATE TO - 
```
http://localhost:3000
```

## PROJECT STRUCTURE
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **auth**                 | Contains middleware to authorize user  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **config**               | Contains passport-local strategy for local user-name and password authentication                               |
| **model**                | Models define schemas that will be used in storing and retrieving data from Application database  
| **public**               | Contains images for avatar edit avatar section 
| **views**                | Contains ejs templates for diffrent routes
| **routes**               | Contain all express routes, separated by module/area of application  
| **views/partial**        | Contains ejs partials                       
| **index.js**             | Entry point to express app                                                               |
| package.json             | Contains npm dependencies 

## FEATURES
- Login user
- SignUp user
- Reset password for user
- Create a note
- Edit a note
- Add note to favourites
- Delete a note
- Edit avatar
- Edit profile
- Undo redo functionality
- Notes above 24 hour timestamp gets deleted automatically
- Admin Panel
- Edit username through admin
- Delete user 
- View all users idea with favIdea count using aggregation pipelining
- Dark theme
