import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {MatchSeeder} from "./MatchSeeder.js";
import {MessageSeeder} from "./MessageSeeder.js";
import {UserSeeder} from "./UserSeeder.js";

export class DatabaseSeeder extends Seeder {

	async run(em: EntityManager): Promise<void> {
		return this.call(em, [
			UserSeeder,
			MessageSeeder,
		  	MatchSeeder
		]);
	}

}
