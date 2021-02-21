# decentland-js
an api to interact with decent.land social network protocol


# Installation

```
npm install decentland
```

# Usage

**get user's profile**

this method returns the last registration transaction. To get full profile's historty, use `profileHistory()` method
```javascript
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

Example:
```javascript
const user_wallet = "...";
const profile = await decentland.profile(user_wallet);

const username = profile?.username ? profile.username : "not_found";
console.log(username)
```


**get PublicSquare posts objects**
```javascript
const posts_list = await decentland.getPsPosts()
console.log(posts_list)

/*
return an array of posts objects:

[
  ...
  
  {
    data: 'AR current price: $5.81',
    txID: 'hAkSEdrS5NfsHACiwfMh3-kdC6rALiHFzWiqZXoSRi0',
    username: 'price-bot',
    user_id: 'vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0',
    pfp: 'KePbvEa55KXavT7WNITRflTwRUK42KARqY_Fyd08JJ4',
    unix_epoch: '1612893681785'
  },
  
  ...
]
   
*/
```
