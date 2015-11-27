package src.entities;

import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.TextFormatAlign;

/**
 * ...
 * @author oscarqpe
 */
class Ficha extends Sprite
{
	public var id:Int;
	public var color:Int;
	public var text:TextField;
	public var position:Int;
	public function new(_id:Int, _color:Int, _posx:Int, _posy:Int, _position:Int) 
	{
		super();
		this.id = _id;
		this.position = _position;
		this.color = _color;
		this.graphics.beginFill(_color);
		this.graphics.drawRect(0, 0, 100, 100);
		this.graphics.endFill();
		
		this.x = _posx;
		this.y = _posy;
		
		var scoreFormat:TextFormat = new TextFormat("Arial", 24, 0xffffff, true);
		scoreFormat.align = TextFormatAlign.CENTER;
		text = new TextField();
		this.addChild(text);
		text.x = 0;
		text.y = 0 + 30;
		text.defaultTextFormat = scoreFormat;
		text.text = "" + id + "";
		text.selectable = false;
	}
}