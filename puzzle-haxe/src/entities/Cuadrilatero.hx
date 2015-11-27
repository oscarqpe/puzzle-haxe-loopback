package src.entities;

import openfl.display.Sprite;
/**
 * ...
 * @author oscarqpe
 */
class Cuadrilatero extends Sprite
{
	
	public function new(color:Int) 
	{
		super();
		this.graphics.beginFill(color);
		this.graphics.drawRect(0, 0, 100, 100);
		this.graphics.endFill();
	}
	
}