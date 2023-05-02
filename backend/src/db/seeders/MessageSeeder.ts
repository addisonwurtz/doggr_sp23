import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Message } from "../entities/Message.js";

export class MessageSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(Message, {
			sender: 1,
			receiver: 2,
			message: "Hello Dogbert, how are you? \nI'm Spot!"
		});
	  
	  	em.create(Message, {
			sender: 1,
			receiver: 3,
			message: "Hi Doglord, how are you? \nI'm Spot!"
	  	});
	  
	  	em.create(Message, {
			sender: 1,
			receiver: 4,
			message: "Hello NotADog, how are you? \nI'm Spot!"
		  });
		
		em.create(Message, {
			sender: 2,
			receiver: 1,
			message: "Pretty good, hbu?"
		});
		
		em.create(Message, {
			sender: 2,
			receiver: 1,
			message: "Enjoying the weather!"
		});
		
		em.create(Message, {
			sender: 3,
			receiver: 2,
			message: "I've been playing a lot of frisbee lately :P"
		});
	}
}
