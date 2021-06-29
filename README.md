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


## Next Steps for CEBU App:
Admin panel:
- Add a global control (button) to start/stop VOTATION

- Configure 3 subsections: 
    - Users And Churches:
        - create church
        - create user
    - List and see results
        - list how many assist are LOGGED IN by church.
        - list how many assist had/are voting/voted by church (Total agains Voted).
        - list 

- Add a button to create/configure new election
- List elecions available (created) and its states (disabled/enabled)
    - for each election list its options

- 

////////////////

Pending for Elections:
Add #2 secionts:
- ABM: to add / modify / delete elections and its options
- Listing: to see details about active-inactive elections

TODO: 

ABM:
    - Create Election 
    - Add options to Election
    - Create button to on/off election (xxxxxx Add main button "Enable/disable votation" xxxxx)
LIST:
    - User logged
    - Votes for church
