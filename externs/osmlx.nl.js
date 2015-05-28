/** @type {Object} */
osmlx.ovapi;
/***
 * @typedef {{
 *   Latitude:number,
 *   TimingPointName:string,
 *   StopAreaCode:string,
 *   Longitude:number,
 *   TimingPointCode:string,
 *   TimingPointTown:string
 * }}
 */
osmlx.ovapi.StopType;

/**
 * @typedef {{
 *   DestinationName50:string,
 *   LinePublicNumber:string,
 *   ExpectedDepartureTime:string
 * }}
 */
osmlx.ovapi.PassType;

/**
 * @typedef {{
 *   Passes:Array<osmlx.ovapi.PassType>,
 *   Stop:osmlx.ovapi.StopType
 * }}
 */
osmlx.ovapi.DataType;
