// ARCHIVED storm scenarios. Level per sol: 0 calm, 1 minor, 2 strong, 3 extreme.
// Levels are a simplified mapping of the largest solar flare class on that date
// (C/M/X) from NASA DONKI / NOAA records. Flare classes below are real archived events.
const ARCHIVE = {
 halloween2003:{name:"Halloween Storms, Oct-Nov 2003",start:"2003-10-24",
  levels:[1,1,2,1,3,3,1,1,1,3,2,3,1,0],
  notes:{4:"X17 flare on Oct 28",5:"X10 flare on Oct 29",9:"X8 flare on Nov 2",10:"X4 flare on Nov 3",11:"Giant X28 flare on Nov 4"}},
 may2024:{name:"Gannon Superstorm, May 2024",start:"2024-05-06",
  levels:[1,2,2,3,3,3,2,1,3,2,1,1,0,0],
  notes:{3:"X2 flare on May 9",4:"X4 flare, G5 storm on May 10-11",5:"X6 flare on May 11",8:"X9 flare on May 14"}}
};
const LEVELS=["Calm","Minor storm","Strong storm","Extreme storm"];
const SRC={
 dosimetry:"https://osdr.nasa.gov/bio/repo/",
 donki:"https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
 veggie:"https://osdr.nasa.gov/bio/repo/",
 artemis:"https://www.nasa.gov/humans-in-space/artemis/"};
