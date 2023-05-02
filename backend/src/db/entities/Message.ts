import {Entity, Property, ManyToOne, PrimaryKey} from "@mikro-orm/core";
import { User } from "./User.js";
import type { Rel } from '@mikro-orm/core';


@Entity({tableName: "Messages"})
export class Message{
	
	@PrimaryKey()
	messageId!: number;
	
	// The person who sent the message
	@ManyToOne()
	sender!: Rel<User>;
	
	// The account who the message was sent to
	@ManyToOne()
	receiver!: Rel<User>;

	// The message body
	@Property()
	message!: string;
	
	@Property()
	created_at = new Date();
	
	@Property({onUpdate: () => new Date()})
	updated_at = new Date();

}
