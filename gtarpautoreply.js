exports.getScriptManifest = () => {
	return {
		name: "Platys Can Autoreply Script",
		description: "auto respond to messages",
		version: "0.1",
		author: "PlatypusMuerte",
		website: "https://twitter.com/PlatypusMuerte"
	};
};

function getDefaultParameters() {
	return new Promise((resolve, reject) => {
		resolve({
			channelName: {
				type: "string",
				description: "Type your channel name"
			},
			gamerTag: {
				type: "string",
				description: "Type your gamer tag"
			}
		});
	});
}
exports.getDefaultParameters = getDefaultParameters;

function findIt(bucket, sentence) {
	let found = false;

	bucket.forEach((str) => {
		if(sentence.includes(str)) {
			found = true;
		}
	});

	return found;
}

function run(runRequest) {
	let currentTitle,currentGame;
	let channel = runRequest.parameters.channelName;
	let gamerTag = runRequest.parameters.gamerTag;
	let args = runRequest.command.args;
	let argSentence = args.join(" ").toLowerCase();
	let urls = {
		channel: "https://mixer.com/api/v1/channels/" + channel
	};

	let bucket = [
		"i join",
		"i play",
		"me",
		"this xbox",
		"this pc"
	];
	
	const request = runRequest.modules.request;
	
	return new Promise((resolve, reject) => {
		request(urls.channel, function (error, response, data) {
			if (!error) {
				channelData = JSON.parse(data);
				currentTitle = channelData.name.toLowerCase();
				currentGame = channelData.type.name.toLowerCase();
				
				if(currentGame == "grand theft auto v") {
					if(currentTitle.includes("| rp")) {
						if(findIt(bucket, argSentence)) {
							resolve({
								success: true,
								effects: [{
									type: EffectType.CHAT,
									message: "This is a PC RP server, not GTA Online on Xbox.",
									chatter: "Streamer"
								}]
							});
						} else {
							resolve({
								success: true,
								effects: []
							});
						}
					} else {
						if(argSentence == "this xbox") {
							resolve({
								success: true,
								effects: [{
									type: EffectType.CHAT,
									message: "Yes this is Xbox and my Gamer tag is " + gamerTag,
									chatter: "Streamer"
								}]
							});
						} else if(argSentence == "this pc") {
							resolve({
								success: true,
								effects: [{
									type: EffectType.CHAT,
									message: "No this is Xbox and my Gamer tag is " + gamerTag,
									chatter: "Streamer"
								}]
							});
						} else {
							resolve({
								success: true,
								effects: [{
									type: EffectType.CHAT,
									message: "My Gamer tag is " + gamerTag,
									chatter: "Streamer"
								}]
							});
						}
					}
				} else {
					resolve({
						success: true,
						effects: []
					});
				}
			} else {
				resolve({
					success: true,
					effects: []
				});
			}
		});
	});
}

exports.run = run;