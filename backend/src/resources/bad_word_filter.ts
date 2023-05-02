import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

export const badWordFilter = async function(message:string) {
	try {
		const data = await fs.readFile(path.resolve(__dirname, './badwords.txt'));
		const badwords = data.toString().split('\r\n');
		const message_words = message.split(" ");
		
		for (const i in badwords) {
		  if (badwords[i].includes(" ") && message.toLowerCase().includes(badwords[i].toLowerCase())) {
				throw new Error("Message cannot be sent. You used a bad word!");
		  }
		  for (const j in message_words) {
				if(message_words[j].toLowerCase() == badwords[i].toLowerCase()) {
			  throw new Error("Message cannot be sent. You used a bad word!");
				}
		  }
		}
	} catch (err) {
		console.log(err);
		throw(err);
	}
	
	
};






