const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const {clerkMiddleware, requireAuth, getAuth, clerkClient} = require("@clerk/express");

require('dotenv').config()

app.use(clerkMiddleware());

app.get('/', requireAuth({signInUrl: process.env.CLERK_SIGN_IN_URL, signUpUrl: process.env.CLERK_SIGN_UP_URL}),  async (req, res) => {
    const {userId} = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    return res.json(user)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})