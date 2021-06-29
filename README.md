## "Asamblea CEBU - 2021" project info

Asamblea is a simple web application made in laravel+reactjs. It was created to run an specific event for CEBU (uruguay). The election of board for 2021-2023 period. 

## Dev info

Prior to run the site (dev env), make sure NODE_ENV has 'development' as value. If not, persist by run:
`export NODE_ENV=development`


Next two lines are required on every React component page:
<p>
/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
</p>

To test in local/dev environment, use (both at same time):
- npm run hot
- php artisan serve

Ports:
- Direct PHP/Laravel project: http://127.0.0.1:8000/
- Proxy for watch/hot dev reload: http://localhost:3003/

# Migrate and Seed:
- Migrate:
    php artisan migrate
- Seed:
    php artisan db:seed
    php artisan db:seed --class=UserSeeder


## Progress and release content info:
CRUD for Admin users (for now admin users are configured hardcoded, according dbId):
- Elections
- Churches
- Users
LIST:
- List of votes
- List of results

Election control:
- Global control (button) to start/stop VOTATION
