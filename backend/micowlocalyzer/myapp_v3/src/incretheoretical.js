const numboards = require('./refresh') 
let theoretical = 0;
let primaryboard ;
const setPrimary = (board) => {
	primaryboard = board;
}
const incTheoretical =() => {
	theoretical = theoretical + numboards - 1
	
}
const getTheoretical=() =>{
	return theoretical;
}