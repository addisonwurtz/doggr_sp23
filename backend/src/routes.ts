import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { Match } from "./db/entities/Match.js";
import {Message} from "./db/entities/Message.js";
import {User} from "./db/entities/User.js";
import {ICreateUsersBody} from "./types.js";
import { badWordFilter } from "./resources/bad_word_filter.js";

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
		return 'hello, you\'ve reached the server!';
	});
	
	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});
	
	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });
	
	// CRUD
	app.post<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const {name, email, petType} = req.body;
		
		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType
			});
			
			await req.em.flush();
			
			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});
	
	//READ
	app.search("/users", async (req, reply) => {
		const {email} = req.body;
		
		try {
			const theUser = await req.em.findOne(User, {email});
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// UPDATE
	app.put<{ Body: ICreateUsersBody }>("/users", async (req, reply) => {
		const {name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});
	
	// DELETE
	app.delete<{ Body: { email, password } }>("/users", async (req, reply) => {
		const {email, password} = req.body;
		
		try {
		  const theUser = await req.em.findOne(User, {email},
				{populate: ['sent_messages', 'recieved_messages', 'matches', 'matched_by']});
		  
		  // check for admin password
		  if (process.env.ADMIN_PASS === password) {
		  	await req.em.remove(theUser).flush();
		  	console.log(theUser);
		  	reply.send(theUser);
		  } else {
				const error = "Admin password is missing or incorrect. User could not be deleted.";
				console.log(error);
				reply.status(401).send(error);
		  }
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// CREATE MATCH ROUTE
	app.post<{ Body: { email: string, matchee_email: string } }>("/match", async (req, reply) => {
		const {email, matchee_email} = req.body;
		
		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, {email: matchee_email});
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, {email});
			
			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee
			});
			
			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
		
	});
	
	//TODO: Check that error messages make sense for new routes
	
	// CREATE new message
	// eslint-disable-next-line max-len
	app.post<{ Body: { sender: string, receiver: string, message: string } }>("/messages", async (req, reply) => {
		const {sender, receiver, message} = req.body;
		
		try {
			// make sure that the reciever exists & get their user account
			const receiver_profile = await req.em.findOne(User, {email: receiver});
			// do the same for the matcher/owner
			const sender_profile = await req.em.findOne(User, {email: sender});
			
			// check for bad words...will throw error if bad words are detected
			await badWordFilter(message);
			
			//create a new message between them
			const newMessage = await req.em.create(Message, {
				sender: sender_profile,
				receiver: receiver_profile,
				message
			});
			
			//persist it to the database
			await req.em.flush();
			// send the message back to the user
			return reply.send(newMessage);
		} catch (err) {
			console.error(err);
			console.log("Failed to send message.");
			return reply.status(500).send(err);
		}
		
	});
	
	// UPDATE Message
	app.put<{ Body: { messageId, message: string } }>("/messages", async (req, reply) => {
		const {messageId, message} = req.body;
		
		const messageToChange = await req.em.findOne(Message, {messageId});
		
		// check for bad words...throws error if bad words are found
		await badWordFilter(message);
		
		// update message
		messageToChange.message = message;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(messageToChange);
		reply.send(messageToChange);
		
	});
	
	// DELETE a specific message
	app.delete<{ Body: { messageId, password } }>("/messages", async (req, reply) => {
		const {messageId, password} = req.body;
		
		try {
			const theMessage = await req.em.findOne(Message, {messageId});
			
		  // check for admin password
		  if (process.env.ADMIN_PASS === password) {
		  	await req.em.remove(theMessage).flush();
		  	console.log(theMessage);
		  	reply.send(theMessage);
		  } else {
				const error = "Admin password is missing or incorrect. Message could not be deleted.";
				console.log(error);
				reply.status(401).send(error);
		  }
			
		} catch (err) {
			console.error(err);
			console.log("Message could not be deleted");
			reply.status(500).send(err);
		}
	});
	
	// DELETE all messages user has sent
	app.delete<{ Body: { sender: string, password } }>("/messages/all", async (req, reply) => {
		const {sender, password} = req.body;
		
		try {
			const theUser = await req.em.findOne(User, {email: sender});
			
		  	// check for admin password
		  	if (process.env.ADMIN_PASS === password) {
			  await req.em.nativeDelete(Message, {sender: theUser});
			  await req.em.flush();
			  console.log(theUser);
			  reply.send(theUser);
		  	} else {
				const error = "Admin password is missing or incorrect. Messages could not be deleted.";
				console.log(error);
				reply.status(401).send(error);
		  	}
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// SEARCH: read all messages user has received
	app.search("/messages", async (req, reply) => {
		const {receiver} = req.body;
		
		try {
			const theUser = await req.em.findOne(User, {email: receiver});
			await theUser.recieved_messages.init();
			console.log(theUser.recieved_messages);
			reply.send(theUser.recieved_messages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// SEARCH: read all messages user has sent
	app.search("/messages/sent", async (req, reply) => {
		const {sender} = req.body;
		
		try {
			const theUser = await req.em.findOne(User, {email: sender});
			await theUser.sent_messages.init();
			console.log(theUser.sent_messages);
			reply.send(theUser.sent_messages);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
}
export default DoggrRoutes;

