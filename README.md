# Backend core for Greenie.one

## DTO and Response guidelines
### Folder structure
Request and response DTOs are split into a directory of their own ```src/dtos/request``` and ```src/dtos/response```. 

### File naming scheme
For each controller there should be 2 files with the same prefix, one for request DTOs and other for response DTOs.

Eg. If your controller is called **profile.controller.ts**, your files should be **src/dtos/request/profile.dto.ts** and **src/dtos/response/profile.response.ts**

### Interface naming scheme
For each route, you'll probably need atleast one request DTO and one response DTO. Naming a DTO should be divided into 3 parts:
- Method prefix
- Route name
- DTO type suffix

#### Method prefix
Method prefix is basically your HTTP method in a human understandable format. We follow the following prefixes

- GET - **"Get"**
- POST - "**Create"**
- [PATCH, PUT] - **"Update"**
- DELETE - **"Delete"**


#### Route names
The route name part of your DTO name will consist of a combination of easy to understand and relavent terms used in your HTTP route.

Eg. If your HTTP route is ```/profile```, your route name part could simply be **"Profile"**

If your HTTP route is something complex such as ```/peer/work```, your route name part could be **WorkPeer** (preferred over PeerWork since WorkPeer is easier to read and more understandable).

#### DTO type suffix
There are 2 suffixes depending on where you're using the DTO.
- Dto - If you're using this to validate your request body
- Response - If you're using it to define your response structure


Combining these all 3 of the above schemes, if your route is ```/profile``` and your HTTP method used is GET, your DTOs will be named as ```GetProfileDto``` and ```GetProfileResponse```

### File contents
Your DTO files should contain no functions, no variables or any other utility used in your actual code. It should contain only the ```types / interfaces / enums / classes``` used to validate your ```request / response```

Since these files are automatically exported to a package, all imports and decorators will be stripped rendering your extra functionality useless

Also make sure you're not importing any types from outside the DTO folder

### Imports
To reuse DTO types, make sure your imports are using relative paths [Eg. ```../request/auth.dto.ts``` and not ```@dtos/request/auth.dto.ts```]

You may import helper functions used for validation from outside the DTO package, but make sure to only use them in decorators