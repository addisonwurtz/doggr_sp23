import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Match } from "../entities/Match.js";

export class MatchSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		em.create(Match, {
	  owner: 1,
	  matchee: 2,
		});
	
	}
}
