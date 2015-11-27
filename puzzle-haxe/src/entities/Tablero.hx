package src.entities;

/**
 * ...
 * @author oscarqpe
 */
class Tablero
{
	public var map:Array<Array<Int>> = new Array<Array<Int>>();
	public function new() 
	{
		map.push([1, 2, 3]);
		map.push([4, 5, 6]);
		map.push([7, 8, 9]);
	}
	
}