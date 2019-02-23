export const CalculateDistance = (lat_1, long_1, lat_2, long_2) => {
    //radians
    const lat1 = (lat_1 * 2.0 * Math.PI) / 60.0 / 360.0;
    const long1 = (long_1 * 2.0 * Math.PI) / 60.0 / 360.0;
    const lat2 = (lat_2 * 2.0 * Math.PI) / 60.0 / 360.0;
    const long2 = (long_2 * 2.0 * Math.PI) / 60.0 / 360.0;

    // use to different earth axis length
    const a = 6378137.0;        // Earth Major Axis (WGS84)
    const b = 6356752.3142;     // Minor Axis
    const f = (a-b) / a;        // "Flattening"
    const e = 2.0*f - f*f;      // "Eccentricity"

    let beta = (a / Math.sqrt( 1.0 - e * Math.sin( lat1 ) * Math.sin( lat1 )));
    let cos = Math.cos( lat1 );
    let x = beta * cos * Math.cos( long1 );
    let y = beta * cos * Math.sin( long1 );
    let z = beta * ( 1 - e ) * Math.sin( lat1 );

    beta = ( a / Math.sqrt( 1.0 -  e * Math.sin( lat2 ) * Math.sin( lat2 )));
    cos = Math.cos( lat2 );
    x -= (beta * cos * Math.cos( long2 ));
    y -= (beta * cos * Math.sin( long2 ));
    z -= (beta * (1 - e) * Math.sin( lat2 ));

    return (Math.sqrt( (x*x) + (y*y) + (z*z) )/1000);
}
