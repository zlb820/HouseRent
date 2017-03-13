var populationData = [
    { city: "Abilene, Texas", change: 1.1297045853 },
    { city: "Akron, Ohio", change: -4.4472522861 },
    { city: "Albuquerque, New Mexico", change: 17.4588342873 },
    { city: "Alexandria, Virginia", change: 15.9027691927 },
    { city: "Allentown, Pennsylvania", change: 1.1445189737 },
    { city: "Amarillo, Texas", change: 8.8365945464 },
    { city: "Anaheim, California", change: 2.6206695478 },
    { city: "Anchorage, Alaska", change: 9.8194070288 },
    { city: "Ann Arbor, Michigan", change: -1.4994897025 },
    { city: "Antioch, California", change: 10.5235562061 },
    { city: "Arlington, Texas", change: 13.5286984157 },
    { city: "Arlington, Virginia", change: 14.7504049555 },
    { city: "Arvada, Colorado", change: 5.8237900111 },
    { city: "Atlanta, Georgia", change: 28.3865347963 },
    { city: "Aurora, Colorado", change: 16.3854944659 },
    { city: "Aurora, Illinois", change: 19.7084636895 },
    { city: "Austin, Texas", change: 16.9797736229 },
    { city: "Bakersfield, California", change: 32.4598288644 },
    { city: "Baltimore, Maryland", change: -1.732202376 },
    { city: "Baton Rouge, Louisiana", change: -1.2971315962 },
    { city: "Beaumont, Texas", change: -2.9884935948 },
    { city: "Bellevue, Washington", change: 12.576458037 },
    { city: "Berkeley, California", change: -0.2164481155 },
    { city: "Billings, Montana", change: 15.111473627 },
    { city: "Birmingham, Alabama", change: -4.9245820096 },
    { city: "Boise City, Idaho", change: 5.1730925563 },
    { city: "Boston, Massachusetts", change: 9.2704845427 },
    { city: "Boulder, Colorado", change: 5.8796169052 },
    { city: "Bridgeport, Connecticut", change: -1.6842105263 },
    { city: "Brownsville, Texas", change: 23.3601640533 },
    { city: "Buffalo, New York", change: -7.5185654153 },
    { city: "Burbank, California", change: 2.6406417964 },
    { city: "Cambridge, Massachusetts", change: 6.9706833984 },
    { city: "Cape Coral, Florida", change: 49.2224469454 },
    { city: "Carrollton, Texas", change: 17.1995609858 },
    { city: "Cary, North Carolina", change: 40.2685528328 },
    { city: "Cedar Rapids, Iowa", change: 4.8655569782 },
    { city: "Centennial, Colorado", change: -1.8371909136 },
    { city: "Chandler, Arizona", change: 38.9571047517 },
    { city: "Charleston, South Carolina", change: 16.7895449128 },
    { city: "Charlotte, North Carolina", change: 23.6136019851 },
    { city: "Chattanooga, Tennessee", change: 9.3002487721 },
    { city: "Chesapeake, Virginia", change: 11.0703354753 },
    { city: "Chicago, Illinois", change: -1.5334269674 },
    { city: "Chula Vista, California", change: 27.4082046376 },
    { city: "Cincinnati, Ohio", change: 0.5294966461 },
    { city: "Clarksville, Tennessee", change: 19.8385669206 },
    { city: "Clearwater, Florida", change: -3.1462561743 },
    { city: "Cleveland, Ohio", change: -9.4854104504 },
    { city: "Colorado Springs, Colorado", change: 10.3927263892 },
    { city: "Columbia, Missouri", change: 19.0007675668 },
    { city: "Columbia, South Carolina", change: 8.3463181704 },
    { city: "Columbus, Georgia", change: 2.0959223613 },
    { city: "Columbus, Ohio", change: 7.4529554968 },
    { city: "Concord, California", change: -0.0441616644 },
    { city: "Coral Springs, Florida", change: 5.6667752416 },
    { city: "Corona, California", change: 17.0643040957 },
    { city: "Corpus Christi, Texas", change: 3.6739007333 },
    { city: "Costa Mesa, California", change: 0.8696684846 },
    { city: "Dallas, Texas", change: 9.1381680665 },
    { city: "Daly City, California", change: -1.4013144561 },
    { city: "Davenport, Iowa", change: 3.1630492324 },
    { city: "Dayton, Ohio", change: -7.2139393501 },
    { city: "Denton, Texas", change: 46.8538157124 },
    { city: "Denver, Colorado", change: 9.7557247516 },
    { city: "Des Moines, Iowa", change: 0.4664165084 },
    { city: "Detroit, Michigan", change: -3.6365290485 },
    { city: "Downey, California", change: -0.3395917456 },
    { city: "Durham, North Carolina", change: 21.3379573251 },
    { city: "Elgin, Illinois", change: 13.2804433487 },
    { city: "Elizabeth, New Jersey", change: 3.6938637003 },
    { city: "Elk Grove, California", change: 65.6199500514 },
    { city: "El Monte, California", change: 4.511892878 },
    { city: "El Paso, Texas", change: 9.855663678 },
    { city: "Erie, Pennsylvania", change: -0.0848937381 },
    { city: "Escondido, California", change: 4.3583787486 },
    { city: "Eugene, Oregon", change: 10.1915224018 },
    { city: "Evansville, Indiana", change: -3.8791646398 },
    { city: "Fairfield, California", change: 6.9771764949 },
    { city: "Fayetteville, North Carolina", change: -0.6809440954 },
    { city: "Flint, Michigan", change: -10.6348353789 },
    { city: "Fontana, California", change: 28.1309844277 },
    { city: "Fort Collins, Colorado", change: 15.5511319152 },
    { city: "Fort Lauderdale, Florida", change: 8.0614147365 },
    { city: "Fort Wayne, Indiana", change: 0.7782162464 },
    { city: "Fort Worth, Texas", change: 33.2575692362 },
    { city: "Fremont, California", change: 0.5986470479 },
    { city: "Fresno, California", change: 11.421234944 },
    { city: "Frisco, Texas", change: 190.2698259736 },
    { city: "Fullerton, California", change: 4.8263433296 },
    { city: "Gainesville, Florida", change: 3.2027398957 },
    { city: "Garden Grove, California", change: 0.5592266349 },
    { city: "Garland, Texas", change: 2.7761832457 },
    { city: "Gilbert, Arizona", change: 89.3125671321 },
    { city: "Glendale, Arizona", change: 14.1712507891 },
    { city: "Glendale, California", change: 0.8022937306 },
    { city: "Grand Prairie, Texas", change: 27.5362658297 },
    { city: "Grand Rapids, Michigan", change: -2.135527971 },
    { city: "Green Bay, Wisconsin", change: -1.3473155831 },
    { city: "Greensboro, North Carolina", change: 11.6428465154 },
    { city: "Gresham, Oregon", change: 12.8672779231 },
    { city: "Hampton, Virginia", change: -1.4942905535 },
    { city: "Hartford, Connecticut", change: -0.0950248836 },
    { city: "Hayward, California", change: 2.336945729 },
    { city: "Henderson, Nevada", change: 43.0727344748 },
    { city: "Hialeah, Florida", change: -3.2041814435 },
    { city: "High Point, North Carolina", change: 19.3501830064 },
    { city: "Hollywood, Florida", change: 2.089432582 },
    { city: "Honolulu, Hawaii", change: 0.9952394559 },
    { city: "Houston, Texas", change: 14.162880073 },
    { city: "Huntington Beach, California", change: 1.7699720531 },
    { city: "Huntsville, Alabama", change: 12.2144699776 },
    { city: "Independence, Missouri", change: 6.6903795529 },
    { city: "Indianapolis, Indiana", change: 3.2134581308 },
    { city: "Inglewood, California", change: -0.4275968525 },
    { city: "Irvine, California", change: 42.9664119327 },
    { city: "Irving, Texas", change: 7.0866264803 },
    { city: "Jackson, Mississippi", change: -5.5268271618 },
    { city: "Jacksonville, Florida", change: 10.4448514288 },
    { city: "Jersey City, New Jersey", change: 1.0311297015 },
    { city: "Joliet, Illinois", change: 36.4205857895 },
    { city: "Kansas City, Kansas", change: -2.4395394782 },
    { city: "Kansas City, Missouri", change: 9.0264010362 },
    { city: "Killeen, Texas", change: 32.5789847355 },
    { city: "Knoxville, Tennessee", change: 5.0075734798 },
    { city: "Lafayette, Louisiana", change: 2.685193459 },
    { city: "Lakewood, Colorado", change: -1.712485285 },
    { city: "Lancaster, California", change: 22.3497024684 },
    { city: "Lansing, Michigan", change: -4.6157456688 },
    { city: "Laredo, Texas", change: 25.979987966 },
    { city: "Las Vegas, Nevada", change: 17.1633088194 },
    { city: "Lewisville, Texas", change: 34.1471192235 },
    { city: "Lincoln, Nebraska", change: 11.5502347377 },
    { city: "Little Rock, Arkansas", change: 4.6675101159 },
    { city: "Long Beach, California", change: 0.0947711428 },
    { city: "Los Angeles, California", change: 3.4543663323 },
    { city: "Lowell, Massachusetts", change: -0.7520369649 },
    { city: "Lubbock, Texas", change: 12.7992169045 },
    { city: "Madison, Wisconsin", change: 12.0669300709 },
    { city: "Manchester, New Hampshire", change: 1.9136971099 },
    { city: "McAllen, Texas", change: 23.5401289358 },
    { city: "McKinney, Texas", change: 128.0142160627 },
    { city: "Memphis, Tennessee", change: -1.9626593411 },
    { city: "Mesa, Arizona", change: 15.9621499654 },
    { city: "Mesquite, Texas", change: 6.7892594044 },
    { city: "Miami, Florida", change: 19.2630590594 },
    { city: "Miami Gardens, Florida", change: 8.5094980051 },
    { city: "Midland, Texas", change: 14.3825523136 },
    { city: "Milwaukee, Wisconsin", change: 1.333893868 },
    { city: "Minneapolis, Minnesota", change: 0.7405664693 },
    { city: "Miramar, Florida", change: 46.4388228666 },
    { city: "Mobile, Alabama", change: -2.8016742632 },
    { city: "Modesto, California", change: 6.6075287758 },
    { city: "Montgomery, Alabama", change: 0.2032580783 },
    { city: "Moreno Valley, California", change: 33.8540794103 },
    { city: "Murfreesboro, Tennessee", change: 48.4786474357 },
    { city: "Naperville, Illinois", change: 11.0766613832 },
    { city: "Newark, New Jersey", change: 2.0130929896 },
    { city: "New Haven, Connecticut", change: -0.3466414564 },
    { city: "New Orleans, Louisiana", change: -26.6328001108 },
    { city: "Newport News, Virginia", change: 7.1588255199 },
    { city: "New York, New York", change: 4.6976500584 },
    { city: "Norfolk, Virginia", change: -0.4076179745 },
    { city: "Norman, Oklahoma", change: 12.6429183751 },
    { city: "North Las Vegas, Nevada", change: 90.1842622729 },
    { city: "Norwalk, California", change: -1.9662598982 },
    { city: "Oakland, California", change: 2.1251690901 },
    { city: "Oceanside, California", change: 6.7652598104 },
    { city: "Odessa, Texas", change: 11.3590420538 },
    { city: "Oklahoma City, Oklahoma", change: 10.3932589804 },
    { city: "Olathe, Kansas", change: 29.9126544525 },
    { city: "Omaha, Nebraska", change: 10.9457191096 },
    { city: "Ontario, California", change: 8.1549689911 },
    { city: "Orange, California", change: 5.4409987608 },
    { city: "Orlando, Florida", change: 21.1259070577 },
    { city: "Overland Park, Kansas", change: 15.294156422 },
    { city: "Oxnard, California", change: 9.2772151456 },
    { city: "Palm Bay, Florida", change: 26.8433281005 },
    { city: "Palmdale, California", change: 22.5112313661 },
    { city: "Pasadena, California", change: 6.7838561023 },
    { city: "Pasadena, Texas", change: 2.6986855267 },
    { city: "Paterson, New Jersey", change: -2.3267184162 },
    { city: "Pembroke Pines, Florida", change: 6.0466865836 },
    { city: "Peoria, Arizona", change: 47.1167192429 },
    { city: "Peoria, Illinois", change: 2.2047634215 },
    { city: "Philadelphia, Pennsylvania", change: 2.212775796 },
    { city: "Phoenix, Arizona", change: 20.0951471631 },
    { city: "Pittsburgh, Pennsylvania", change: -6.6094700977 },
    { city: "Plano, Texas", change: 22.0456846678 },
    { city: "Pomona, California", change: 2.8728259695 },
    { city: "Pompano Beach, Florida", change: 2.275581604 },
    { city: "Portland, Oregon", change: 6.8351568721 },
    { city: "Port St. Lucie, Florida", change: 73.1539108495 },
    { city: "Providence, Rhode Island", change: -1.1227359787 },
    { city: "Provo, Utah", change: 13.3545956996 },
    { city: "Pueblo, Colorado", change: 2.6866928417 },
    { city: "Raleigh, North Carolina", change: 39.7775204698 },
    { city: "Rancho Cucamonga, California", change: 33.0470673874 },
    { city: "Reno, Nevada", change: 19.3849097422 },
    { city: "Richardson, Texas", change: 11.8334218311 },
    { city: "Richmond, California", change: 3.5502067692 },
    { city: "Richmond, Virginia", change: 3.3928047658 },
    { city: "Riverside, California", change: 15.2515023585 },
    { city: "Rochester, Minnesota", change: 15.789827019 },
    { city: "Rochester, New York", change: -5.5496323027 },
    { city: "Rockford, Illinois", change: 3.5922700987 },
    { city: "Roseville, California", change: 42.2876331521 },
    { city: "Round Rock, Texas", change: 73.7662765782 },
    { city: "Sacramento, California", change: 14.0375827774 },
    { city: "Salem, Oregon", change: 12.732216663 },
    { city: "Salinas, California", change: 0.5442622494 },
    { city: "Salt Lake City, Utah", change: 0.7278068424 },
    { city: "San Antonio, Texas", change: 18.0304599059 },
    { city: "San Bernardino, California", change: 4.968812659 },
    { city: "San Buenaventura, California", change: 3.1531843013 },
    { city: "San Diego, California", change: 6.4799267039 },
    { city: "San Francisco, California", change: 4.8880827416 },
    { city: "San Jose, California", change: 6.7683777143 },
    { city: "Santa Ana, California", change: 0.5412016331 },
    { city: "Santa Clara, California", change: 9.3848888542 },
    { city: "Santa Clarita, California", change: 8.7040892384 },
    { city: "Santa Rosa, California", change: 5.4878212171 },
    { city: "Savannah, Georgia", change: 1.4865211036 },
    { city: "Scottsdale, Arizona", change: 16.4275399564 },
    { city: "Seattle, Washington", change: 9.3131971381 },
    { city: "Shreveport, Louisiana", change: -0.6635921725 },
    { city: "Simi Valley, California", change: 7.9912121672 },
    { city: "Sioux Falls, South Dakota", change: 25.8045510279 },
    { city: "South Bend, Indiana", change: -3.8243246985 },
    { city: "Spokane, Washington", change: 3.2252167157 },
    { city: "Springfield, Illinois", change: 5.1650094444 },
    { city: "Springfield, Massachusetts", change: 2.4260179729 },
    { city: "Springfield, Missouri", change: 3.5465838101 },
    { city: "Stamford, Connecticut", change: 3.015755471 },
    { city: "Sterling Heights, Michigan", change: 2.0101066816 },
    { city: "St. Louis, Missouri", change: 2.7912621359 },
    { city: "Stockton, California", change: 17.5654406384 },
    { city: "St. Paul, Minnesota", change: -1.9245254069 },
    { city: "St. Petersburg, Florida", change: -1.7796913379 },
    { city: "Sunnyvale, California", change: 1.6210762672 },
    { city: "Syracuse, New York", change: -5.1413705758 },
    { city: "Tacoma, Washington", change: 2.9709404883 },
    { city: "Tallahassee, Florida", change: 12.8177973027 },
    { city: "Tampa, Florida", change: 13.0633192726 },
    { city: "Tempe, Arizona", change: 12.3750472114 },
    { city: "Thornton, Colorado", change: 41.2626547695 },
    { city: "Thousand Oaks, California", change: 5.1484609098 },
    { city: "Toledo, Ohio", change: 0.7931371955 },
    { city: "Topeka, Kansas", change: 0.7658891608 },
    { city: "Torrance, California", change: 1.509068154 },
    { city: "Tucson, Arizona", change: 11.1483483361 },
    { city: "Tulsa, Oklahoma", change: -0.8209240168 },
    { city: "Vallejo, California", change: -2.3329925017 },
    { city: "Vancouver, Washington", change: 13.0773534188 },
    { city: "Victorville, California", change: 71.8985850884 },
    { city: "Virginia Beach, Virginia", change: 1.6507476543 },
    { city: "Visalia, California", change: 27.7097975234 },
    { city: "Waco, Texas", change: 10.1154178335 },
    { city: "Warren, Michigan", change: -3.0580176109 },
    { city: "Washington, District of Columbia", change: 4.8820800918 },
    { city: "Waterbury, Connecticut", change: -0.1565543141 },
    { city: "West Covina, California", change: 0.1728690564 },
    { city: "West Jordan, Utah", change: 32.063460111 },
    { city: "Westminster, Colorado", change: 7.7299548083 },
    { city: "West Valley City, Utah", change: 14.5200714057 },
    { city: "Wichita Falls, Texas", change: -2.6949673454 },
    { city: "Wichita, Kansas", change: 5.62483327 },
    { city: "Wilmington, North Carolina", change: 12.905921016 },
    { city: "Winston-Salem, North Carolina", change: 13.6648235888 },
    { city: "Worcester, Massachusetts", change: 6.0185507246 },
    { city: "Yonkers, New York", change: 2.4691546776 }
];