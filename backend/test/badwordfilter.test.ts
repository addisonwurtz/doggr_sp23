import 'chai/register-should.js';  // Using Should style

import {test, teardown} from "tap";
import {faker} from "@faker-js/faker";
import app from '../src/app.js';

test("Blocking a message with a bad word", async () => {
  
	const payload = {
		sender: "email@email.com",
		receiver: "email2@email.com",
		message: "crap"
	};
  
	const response = await app.inject({
		method: "POST",
		url: "/messages",
		payload
	});
  
	response.statusCode.should.equal(500);
});

test("Blocking a message with a funny format bad word", async () => {
  
	const payload = {
		sender: "email@email.com",
		receiver: "email2@email.com",
		message: "f u c k"
	};
  
	const response = await app.inject({
		method: "POST",
		url: "/messages",
		payload
	});
  
	response.statusCode.should.equal(500);
});

test("Send a message", async () => {
  
	const payload = {
		sender: "email@email.com",
		receiver: "email2@email.com",
		message: "hello friend!"
	};
  
	const response = await app.inject({
		method: "POST",
		url: "/messages",
		payload
	});
  
	response.statusCode.should.equal(200);
	const resPayload = response.json();
	resPayload.message.should.equal("hello friend!");
});

teardown( () => app.close());
