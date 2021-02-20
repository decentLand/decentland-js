# decentland-js
an api to interact with decent.land social network protocol


# Installation

```
npm install decentland
```

# Usage

**get user's profile**
```
//CommonJS
const decentland = require('decentland'); 

const user_address = "...";
const profile = await decentland.profile(user_address);


// returns an object with the following properties:
// username: String
// user_id: String
// bio: String
// pfp: String
// registration_unix_epoch: Number

```
if the wallet isn't bound to a profile, the method returns an empty object `{}`
