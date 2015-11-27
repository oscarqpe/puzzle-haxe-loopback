module.exports = function(Score) {

	Score.top_scores = function(cb) {
      	var ds = Score.dataSource;
        var sql = "select u.*, (select min(s.score)	from score s where s.id_user = u.id) as score_ from user u order by score_"; 
        
        ds.connector.query(sql, null, function (err, scores) {
        	//console.log(scores);
            if (err) 
            	cb(err);
            else {
            	cb(null, scores);
        	}
        });
    }
	Score.remoteMethod(
		'top_scores',
		{
			description: 'Top scores.',
			accepts: [
				//{ arg: 'id', type: 'number', required: true, description: 'User id'},
				//{ arg: 'data', type: 'object', required: true, description: 'Data' }
			],
			http: { verb: 'post', path: '/top_scores'},
			isStatic: true,
			returns: { arg: 'data', type: 'object'}
		}
	);

	Score.registrar = function(id, idUser, score, cb) {
		var score = {
			id : id,
			idUser: idUser,
			score: score
		};
      	Score.create(score,
			function (err, score) {
				if (err) {
					console.log(cb);
					console.log(err);
					cb(err);
				} else {
					cb(null, score);
				}
			});
    }
	Score.remoteMethod(
		'registrar',
		{
			description: 'Top scores.',
			accepts: [
				{ arg: 'id', type: 'number', required: true, description: 'score id'},
				{ arg: 'idUser', type: 'number', required: true, description: 'user id' },
				{ arg: 'score', type: 'string', required: true, description: 'score value' }
			],
			http: { verb: 'get', path: '/registrar'},
			isStatic: true,
			returns: { arg: 'data', type: 'object'}
		}
	);
	Score.info = function (cb) {
		cb(null, ["hola"]);
	}
	Score.remoteMethod(
		'info',
		{
			description: 'Info',
			accepts: [
			],
			http: { verb: 'get', path: '/info'},
			isStatic: true,
			returns: { arg: 'data', type: 'object'}
		}
	);
};
