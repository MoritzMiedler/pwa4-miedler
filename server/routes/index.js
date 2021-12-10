const express = require('express');
const asyncHandler = require('express-async-handler');
const webpush = require('web-push');
require('dotenv').config();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const { getEmployees } = require('../model/employees');

const subscription = [];

const router = express.Router();

webpush.setVapidDetails('mailto:miedler.m03@htlwienwest.at', publicVapidKey, privateVapidKey);

router.get(
  '/employees',
  asyncHandler(async (req, res) => {
    res.json(getEmployees());
  }),
);

router.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    subscription.push(req.body);
    console.log(subscription);
    res.status(201).end();
  }),
);

router.post('/notify', (req, res) => {
  const payload = JSON.stringify({ title: 'Push Test', body: req.body });
  for (const sub of subscription) {
    try {
      console.log('test');
      webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).send('ok');
});

module.exports = router;
