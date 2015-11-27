package;

import haxe.Http;
import haxe.Json;
import js.Browser;
import js.Cookie;
import models.*;
import openfl.display.Sprite;
import openfl.display.BitmapData;
import openfl.Lib;
import flash.events.Event;
import flash.events.MouseEvent;
import flash.events.TouchEvent;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.TextFormatAlign;

import openfl.Assets;
import openfl.display.Tilesheet;
import openfl.geom.Rectangle;
import flash.display.Bitmap;

import src.entities.*;
import jQuery.*;

import haxe.Timer;

import com.gemioli.io.Socket;
import com.gemioli.io.events.SocketEvent;


/**
 * ...
 * @author oscarqpe
 */
class Main extends Sprite 
{
	private var inited:Bool;
	private var fichaCero:Ficha;
	
	
	/* ENTRY POINT */
	private var fichas:Array<Ficha>;
	public var map:Tablero = new Tablero();
	
	private var title:TextField;
	private var score:TextField;
	private var random:TextField;
	private var winner:TextField;
	private var countScore = 0;
	
	private var tilesheet:Tilesheet;
	public var pixeles = 100;
	private var terrainCanvas:Sprite;
	public var usuariosScore:ScoresResponse;
	public var tableScore = new Cuadrilatero(0xE0E7EC);
	public var logout = new Cuadrilatero(0xD74634);
	
	public var userScores = new Array<TextField>();
	public var scores = new Array<TextField>();
	
	private var _socket : Socket;
	private var _socketChat : Socket;
	private var _pingId : Int;
	
	function resize(e) 
	{
		if (!inited) init();
		// else (resize or orientation change)
		
	}
	function init() {
		if (inited) return;
		inited = true;
		fichas = new Array<Ficha>();
		
		// Tilesheet initialization
		var tilesBitmapData:BitmapData = Assets.getBitmapData("img/template1.png");
		terrainCanvas = new Sprite();
		addChild(terrainCanvas);
		
		tilesheet = new Tilesheet(tilesBitmapData);
		tilesheet.addTileRect(new Rectangle(0 * pixeles, 0 * pixeles, 1 * pixeles, 1 * pixeles));
		tilesheet.addTileRect(new Rectangle(1 * pixeles, 0 * pixeles, 2 * pixeles, 1 * pixeles));
		tilesheet.addTileRect(new Rectangle(2 * pixeles, 0 * pixeles, 3 * pixeles, 1 * pixeles));
		tilesheet.addTileRect(new Rectangle(0 * pixeles, 1 * pixeles, 1 * pixeles, 2 * pixeles));
		tilesheet.addTileRect(new Rectangle(1 * pixeles, 1 * pixeles, 2 * pixeles, 2 * pixeles));
		tilesheet.addTileRect(new Rectangle(2 * pixeles, 1 * pixeles, 3 * pixeles, 2 * pixeles));
		tilesheet.addTileRect(new Rectangle(0 * pixeles, 2 * pixeles, 1 * pixeles, 3 * pixeles));
		tilesheet.addTileRect(new Rectangle(1 * pixeles, 2 * pixeles, 2 * pixeles, 3 * pixeles));
		
		tableScore.x = 600;
		tableScore.y = 0;
		tableScore.width = 200;
		tableScore.height = 480;
		
		this.addChild(tableScore);
		
		InsertarUsuarios();
		
		var lista = [1, 2, 3, 4, 5, 6, 7, 8];
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			//Browser.console.log(a + ", " + b + ", " + c);
			if (c < 0.5)
				return 1;
			return 1;
		});
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			//Browser.console.log(a + ", " + b + ", " + c);
			if (c < 0.5)
				return 1;
			return 0;
		});
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			//Browser.console.log(a + ", " + b + ", " + c);
			if (c < 0.5)
				return 1;
			return 0;
		});
		//Browser.console.log(lista);
		var count = 0;
		for (j in 0...3) {
			for (i in 0...3) {
				count++;
				if (i == j && i == 2) {
					fichaCero = new Ficha(count, 0x000000, i * 100, j * 100, count);
					fichaCero.text.text = "";
					this.addChild(fichaCero);
				} else {
					var ficha = new Ficha(lista[count - 1], 0x9ACA11 + count * 100, i * 100, j * 100, count);
					fichas.push(ficha);
					this.addChild(ficha);
				}
			}
		}
		
		var titleFormat:TextFormat = new TextFormat("Arial", 24, 0x46629E, true);
		var paragraphFormat:TextFormat = new TextFormat("Arial", 16, 0x4486F6, true);
		var titleScoreFormat:TextFormat = new TextFormat("Arial", 16, 0x4486F6, false);
		var btnFormat:TextFormat = new TextFormat("Arial", 16, 0xffffff, true);
		var winnerFormat:TextFormat = new TextFormat("Arial", 50, 0xD74634, true);
		
		//titleFormat.align = TextFormatAlign.CENTER;
		//paragraphFormat.align = TextFormatAlign.CENTER;
		btnFormat.align = TextFormatAlign.CENTER;
		
		title = new TextField();
		score = new TextField();
		random = new TextField();
		winner = new TextField();
		
		this.addChild(title);
		this.addChild(score);
		this.addChild(winner);
		
		title.text = "PUZZLE";
		title.x = 400;
		title.y = 50;
		title.defaultTextFormat = titleFormat;
		
		var titleScore = new TextField();
		titleScore.text = "TOP SCORES";
		titleScore.x = 610;
		titleScore.y = 10;
		titleScore.width = 180;
		titleScore.defaultTextFormat = titleScoreFormat;
		this.addChild(titleScore);
		
		score.text = "0 Movement";
		score.x = 400;
		score.y = 100;
		score.width = 600;
		score.defaultTextFormat = paragraphFormat;
		
		random.text = "RESET";
		random.x = 440;
		random.y = 205;
		random.defaultTextFormat = btnFormat;
		
		winner.text = "";
		winner.x = 150;
		winner.y = 350;
		winner.width = 800;
		winner.defaultTextFormat = winnerFormat;
		
		var btn = new Cuadrilatero(0x009688);
		btn.x = 400;
		btn.y = 200;
		btn.width = 200;
		btn.height = 30;
		
		this.addChild(btn);
		this.addChild(random);
		
		logout.x = 560;
		logout.y = 0;
		logout.width = 40;
		logout.height = 40;
		
		this.addChild(logout);
		
		var logoutText = new TextField();
		logoutText.text = "X";
		logoutText.x = 560;
		logoutText.y = 10;
		logoutText.width = 40;
		logoutText.defaultTextFormat = btnFormat;
		
		this.addChild(logoutText);
		
		drawTerrain();
		
		this.addEventListener(MouseEvent.CLICK, click);
		this.addEventListener(TouchEvent.TOUCH_BEGIN, touched);
	}
	private function InsertarUsuarios() {
		usuariosScore = new ScoresResponse();
		tableScore = new Cuadrilatero(0xE0E7EC);
		tableScore.x = 600;
		tableScore.y = 0;
		tableScore.width = 200;
		tableScore.height = 480;
		
		this.addChild(tableScore);
		
		var titleScoreFormat:TextFormat = new TextFormat("Arial", 16, 0x4486F6, false);
		var titleScore = new TextField();
		titleScore.text = "TOP SCORES";
		titleScore.x = 610;
		titleScore.y = 10;
		titleScore.width = 180;
		titleScore.defaultTextFormat = titleScoreFormat;
		this.addChild(titleScore);
		
		JQuery._static.post("/api/Scores/top_scores", function(data) {
			//Browser.console.log(data);
			usuariosScore = data;
			var scoreFormat:TextFormat = new TextFormat("Arial", 14, 0x1C1C1F, false);
			var j = 0;
			
			for (i in 0...userScores.length) {
				userScores[i].text = "";
				scores[i].text = "";
			}
			for (i in 0...userScores.length) {
				userScores.pop();
				scores.pop();
			}
			
			for (i in 0...usuariosScore.data.length) {
				if (usuariosScore.data[i].score_ != null && usuariosScore.data[i].score_ != "NULL" && usuariosScore.data[i].score_ != "null") {
					var text = new TextField();
					var text2 = new TextField();
					text.defaultTextFormat = scoreFormat;
					text.text = "" + (j + 1) + ". " + usuariosScore.data[i].username + "";
					text.x = 610;
					text.y = 30 + j * 25;
					text.width = 150;
					this.addChild(text);
					
					text2.defaultTextFormat = scoreFormat;
					text2.text = "" + usuariosScore.data[i].score_ + "";
					text2.x = 760;
					text2.y = 30 + j * 25;
					text2.width = 30;
					
					this.addChild(text2);
					j++;
					
					userScores.push(text);
					scores.push(text2);
				}
			}
		});
	}
	private function drawTerrain():Void {
		var tileData:Array<Float> = [];
		
		// Terrain
		for (row in 0...map.map.length) {
			for (cell in 0...map.map[row].length) {
				//Browser.console.log([100 * cell, 100 * row, map.map[row][cell]]);
				tileData = tileData.concat([100 * cell, 100 * row, map.map[row][cell]]);
			}
		}
		
		tilesheet.drawTiles(terrainCanvas.graphics, tileData);
	}
	public function click(event:MouseEvent) {
		//Browser.console.log(event.stageX + ", " + event.stageY);
		//fichaCero.x = fichaCero.x + 10;
		//fichaCero.y = fichaCero.y + 10;
		var count = 0;
		for (i in 0...3) {
			for (j in 0...3) {
				if (event.stageX > i * 100 && event.stageY > j * 100 
					 && event.stageX < (i + 1) * 100 && event.stageY < (j + 1) * 100) {
					//Browser.console.log("posicion " + map.map[j][i]);
					var ficha = buscarFicha(map.map[j][i]);
					swapFichaCero(ficha);
				}
			}
		}
		if (event.stageX > 400 && event.stageY > 200 
			 && event.stageX < 600 && event.stageY < 230) {
			resetPuzzle();
		}
		if (event.stageX > 560 && event.stageY > 0 
			 && event.stageX < 600 && event.stageY < 40) {
			Logout();
		}
	}
	public function Logout() {
		Cookie.remove("e_session_");
		Cookie.remove("e_session_conect");
		//Browser.location.href = "/";
	}
	public function touched(event:TouchEvent) {
		//Browser.console.log(event.stageX + ", " + event.stageY);
		//fichaCero.x = fichaCero.x + 10;
		//fichaCero.y = fichaCero.y + 10;
		var count = 0;
		for (i in 0...3) {
			for (j in 0...3) {
				if (event.stageX > i * 100 && event.stageY > j * 100 
					 && event.stageX < (i + 1) * 100 && event.stageY < (j + 1) * 100) {
					//Browser.console.log("posicion " + map.map[j][i]);
					var ficha = buscarFicha(map.map[j][i]);
					swapFichaCero(ficha);
				}
			}
		}
		if (event.stageX > 400 && event.stageY > 200 
			 && event.stageX < 600 && event.stageY < 230) {
			resetPuzzle();
		}
		if (event.stageX > 560 && event.stageY > 0 
			 && event.stageX < 600 && event.stageY < 40) {
			Logout();
		}
	}
	public function resetPuzzle():Void {
		countScore = 0;
		score.text = countScore + " Movements";
		winner.text = "";
		for (i in 0...8) {
			fichas.pop();
		}
		var lista = [1, 2, 3, 4, 5, 6, 7, 8];
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			if (c < 0.5)
				return 1;
			return 1;
		});
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			if (c < 0.5)
				return 1;
			return 0;
		});
		lista.sort(function(a:Int, b:Int):Int {
			var c = Math.random();
			if (c < 0.5)
				return 1;
			return 0;
		});
		var count = 0;
		for (j in 0...3) {
			for (i in 0...3) {
				count++;
				if (i == j && i == 2) {
					fichaCero = new Ficha(count, 0x000000, i * 100, j * 100, count);
					fichaCero.text.text = "";
					this.addChild(fichaCero);
				} else {
					var ficha = new Ficha(lista[count - 1], 0xAACA11 + count * 100, i * 100, j * 100, count);
					fichas.push(ficha);
					this.addChild(ficha);
				}
			}
		}
		 
	}
	public function guardarScore():Void {
		var coockie:Coockie_Haxe = Json.parse(Cookie.get("e_session_"));
		//Browser.console.log(coockie);
		var score:Score = new Score();
		score.id = 0;
		score.idUser = coockie.idUser;
		score.score = countScore;
		
		var url = "/api/Scores/registrar?access_token=" + coockie.id; 
		var request = new Http(url); 

		var data:String = null; 
		var dataLength:Int =  if (data == null) 0; else data.length; 

		var result:String = ""; 
		//request.setPostData(Std.string(score));
		request.setParameter("id", Std.string(0));
		request.setParameter("idUser", Std.string(score.idUser));
		request.setParameter("score", Std.string(score.score));
		request.onData = function(d) { 
			result = d; 
			//Browser.console.log(d);
			InsertarUsuarios();
		}; 
		request.request(false);
	}
	public function swapFichaCero(ficha:Ficha):Void {
		if (ficha == null) {
			//Browser.console.log("Ficha null");
			return;
		}
		//Browser.console.log(ficha.x + " , " + ficha.y);
		var x = fichaCero.x;
		var y = fichaCero.y;
		var pos = fichaCero.position;
		
		var pos_ = ficha.position;
		var flag = false;
		if (pos == 1) {
			if (pos_ == 2 || pos_ == 4) {
				flag = true;
			}
		}
		else if (pos == 2) {
			if (pos_ == 1 || pos_ == 3 || pos_ == 5) {
				flag = true;
			}
		}
		else if (pos == 3) {
			if (pos_ == 2 || pos_ == 6) {
				flag = true;
			}
		}
		else if (pos == 4) {
			if (pos_ == 1 || pos_ == 5 || pos_ == 7) {
				flag = true;
			}
		}
		else if (pos == 5) {
			if (pos_ == 2 || pos_ == 4 || pos_ == 6 || pos_ == 8) {
				flag = true;
			}
		}
		else if (pos == 6) {
			if (pos_ == 3 || pos_ == 5 || pos_ == 9) {
				flag = true;
			}
		}
		else if (pos == 7) {
			if (pos_ == 4 || pos_ == 8) {
				flag = true;
			}
		}
		else if (pos == 8) {
			if (pos_ == 7 || pos_ == 5 || pos_ == 9) {
				flag = true;
			}
		}
		else if (pos == 9) {
			if (pos_ == 6 || pos_ == 8) {
				flag = true;
			}
		}
		if (flag) {
			fichaCero.x = ficha.x;
			fichaCero.y = ficha.y;
			fichaCero.position = ficha.position;
			ficha.x = x;
			ficha.y = y;
			ficha.position = pos;
			countScore++;
			score.text = countScore + " Movements";
			if (isWinner()) {
				guardarScore();
				winner.text = "Contratulations!";
			}
		}
	}
	public function isWinner():Bool {
		for (i in 0...fichas.length) {
			if (fichas[i].position != fichas[i].id)
				return false;
		}
		return true;
	}
	public function buscarFicha(_position:Int):Ficha {
		for (i in 0...fichas.length) {
			//Browser.console.log(fichas[i].position + ", " + _position);
			if (fichas[i].position == _position) {
				Browser.console.log("Ficha " + fichas[i].id);
				return fichas[i];
			}
		}
		return null;
	}
	/* SETUP */
	public function new() 
	{
		super();	
		addEventListener(Event.ADDED_TO_STAGE, added);
		addEventListener(Event.ADDED_TO_STAGE, chat);
		//Timer.delay(chat, 10);
	}
	function added(e) 
	{
		removeEventListener(Event.ADDED_TO_STAGE, added);
		stage.addEventListener(Event.RESIZE, resize);
		#if ios
		haxe.Timer.delay(init, 100); // iOS 6
		#else
		init();
		#end
	}
	public function main():Void 
	{
		new JQuery(function():Void { //when document is ready
            //your magic
			//Browser.console.log("when document is ready");
        });
		// static entry point
		Lib.current.stage.align = flash.display.StageAlign.TOP_LEFT;
		Lib.current.stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
		Lib.current.addChild(new Main());
		
	}
	private function chat(event):Void
	{
		var socket = new Socket("http://127.0.0.1:3000", { 'transports': ['websocket', 'polling'] } );
		socket.addEventListener("Pong", function (event : SocketEvent) : Void {
			trace("Received pong " + event.args[0]);
			trace("Sending ping " + (++_pingId));
			_socket.emit("Ping", _pingId);
		});
		socket.connect();
		socket.emit("message", "Hola mundo");
		
		// 	WEB SOCKETS
		/*
		_socket = new Socket("http://localhost:3000");
		//_socket = new Socket("http://socketioserver-dimanux.dotcloud.com");
		_socket.addEventListener(SocketEvent.CONNECTING, function(event : SocketEvent) : Void {
			trace("Connecting...");
		});
		_socket.addEventListener(SocketEvent.CONNECT, function(event : SocketEvent) : Void {
			trace("Connected");
		});
		_socket.addEventListener(SocketEvent.CONNECT_FAILED, function(event : SocketEvent) : Void {
			trace("Connect failed");
		});
		_socket.addEventListener(SocketEvent.DISCONNECTING, function(event : SocketEvent) : Void {
			trace("Disconnecting...");
		});
		_socket.addEventListener(SocketEvent.DISCONNECT, function(event : SocketEvent) : Void {
			trace("Disconnected");
		});
		_socket.addEventListener(SocketEvent.ERROR, function(event : SocketEvent) : Void {
			trace("Error: " + event.args.reason + " " + event.args.advice);
		});
		_socket.addEventListener(SocketEvent.MESSAGE, function(event : SocketEvent) : Void {
			if (event.args == "Hello")
			{
				trace("Hello from server!");
				_socket.send("Hi");
			}
		});
		_socket.addEventListener(SocketEvent.RECONNECTING, function(event : SocketEvent) : Void {
			trace("Reconnecting...");
		});
		_socket.addEventListener(SocketEvent.RECONNECT, function(event : SocketEvent) : Void {
			trace("Reconnected");
		});
		_socket.addEventListener(SocketEvent.RECONNECT_FAILED, function(event : SocketEvent) : Void {
			trace("Reconnect failed");
		});
		_socket.addEventListener("ServerEvent", function(event : SocketEvent) : Void {
			trace("Event [ServerEvent] Data [" + event.args[0].name + "]");
			_socket.emit("ClientEventEmpty");
			_socket.emit("ClientEventData", { myData : "Data" } );
			_socket.emit("ClientEventCallback", null, function(data : Dynamic) : Void {
				trace("Callback data[" + data[0] + "]");
				trace("Starting ping-pong...");
				_pingId = 0;
				_socket.emit("Ping", _pingId);
			});
		});
		_socket.addEventListener("Pong", function (event : SocketEvent) : Void {
			trace("Received pong " + event.args[0]);
			trace("Sending ping " + (++_pingId));
			_socket.emit("Ping", _pingId);
		});
		_socket.connect();
		
		_socketChat = new Socket("http://127.0.0.1:3000/chat", {transports : ["xhr-polling"]});
		//_socketChat = new Socket("http://socketioserver-dimanux.dotcloud.com/chat", {transports : ["xhr-polling"]} );
		_socketChat.addEventListener(SocketEvent.CONNECTING, function(event : SocketEvent) : Void {
			trace("Chat Connecting...");
		});
		_socketChat.addEventListener(SocketEvent.CONNECT, function(event : SocketEvent) : Void {
			trace("Chat Connected");
			_socketChat.send("Hi chat!");
		});
		_socketChat.addEventListener(SocketEvent.CONNECT_FAILED, function(event : SocketEvent) : Void {
			trace("Chat Connect failed");
		});
		_socketChat.addEventListener(SocketEvent.DISCONNECTING, function(event : SocketEvent) : Void {
			trace("Chat Disconnecting...");
		});
		_socketChat.addEventListener(SocketEvent.DISCONNECT, function(event : SocketEvent) : Void {
			trace("Chat Disconnected");
		});
		_socketChat.addEventListener(SocketEvent.ERROR, function(event : SocketEvent) : Void {
			trace("Chat Error: " + event.args.reason + " " + event.args.advice);
		});
		_socketChat.addEventListener(SocketEvent.MESSAGE, function(event : SocketEvent) : Void {
			trace("Message from chat: [" + event.args + "]");
		});
		_socketChat.addEventListener(SocketEvent.RECONNECTING, function(event : SocketEvent) : Void {
			trace("Chat Reconnecting...");
		});
		_socketChat.addEventListener(SocketEvent.RECONNECT, function(event : SocketEvent) : Void {
			trace("Chat Reconnected");
		});
		_socketChat.addEventListener(SocketEvent.RECONNECT_FAILED, function(event : SocketEvent) : Void {
			trace("Chat Reconnect failed");
		});
		_socketChat.connect();
		*/
	}
}
