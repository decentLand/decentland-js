# decentland-js
an api to interact with decent.land social network protocol


# Installation

```
npm install decentland
```

# Usage

**get user's profile**

this method returns the full profile's registration historty array
```javascript
//CommonJS
const decentland = require('decentland'); 

const user_address = "...";
const profile = await decentland.profileHistory(user_address);


// returns an array of objects with the following object-properties:
// username: String
// user_id: String
// bio: String
// pfp: String
// registration_unix_epoch: Number

```
if the wallet isn't bound to a profile, the method returns an empty array `[]`

Example:
```javascript
const user_wallet = "...";
const profile = await decentland.profileHistory(user_wallet);

const last_username = profile[0]["username"];
console.log(last_username)
```


**get PublicSquare posts objects**
```javascript
// PublisSquare tribus ID == "null"
const tribus_id = "null"
const posts_list = await decentland.tribusPostsOf(tribus_id)
console.log(posts_list)

/*
return an array of posts transactions ID:

[
  ...
 
  'HRU-OcrAAzj47Zldj0QM26sKSW5wiyne6e0ZAv6pXJ8',
  'SqsxEEI54dl8YtV4x27gV6yqFG8h3BSCUCCSFDqBK9M',
  'Q4VDkVlGTVXgBIKXtSF21b0cZIQOtiKpLZZ0Vn7bUwY',
  'fRUfbUIhwjjIFCuXmiHIZdUbQ5tHs94laK8Ukc2KxhQ',
  'rYeCWiS-XjCtcPG7t2SyGbHM3O4fEmY2iRqeZrxnHd0',
  'dxB1eMkOYOIhG7dd4fEteTq9ss7mOhuY_Q_rJ_i_aJI',
  'xqtKzhVJbVDU3YkjI5JNVjDiiP-cGvh_gZjEPM2BjcQ',
  'wX2usCV5tSgbStjVIBG_MlEBGj_37C_3DXz0c53o0aQ',
  'o13dLXSe6uHLxT0rS1SjdaWTH7ap1q3XfsfKql9RjCE',
  '7cIrfCV3glYx0kQ1YnzQw0ON1PGRyiq4fm-UV9KsFfE',

  ...
]
   
*/
```
