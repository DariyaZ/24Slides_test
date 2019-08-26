# Simple registration form

This is a simple project which is basically a registration form. The general idea is to see your code structure, code quality, and approach in general.

## Getting started

- Run `npm i && npm i -g json-server`
- Run `npm run dev` to start a client development server. By default available at `0.0.0.0:3001`
- Run `node server/app.js` to start a backend server. By default available at `0.0.0.0:3002`
- [Get a mockup](zpl.io/adzK17p). If you don't have access, please write a mail to artem@24slides.com
- If you want to make a build, run `npm run build`

## Requirements

- Create a markup of the page using SASS
- Create React application (on top of Redux) that simply registers a user
- The form should have validation. Users should be registered via server through the endpoint **POST 0.0.0.0:3002/register**
- Countries should be grabbed from **GET 0.0.0.0:3002/countries**

That's it. Enjoy :)