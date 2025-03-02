use TaxiBookingSystem
 select * from bookings order by booking_id desc
 select * from users
 select * from taxis
 select * from drivers
 select * from payments
 select * from ratings

 EXEC sp_rename 'taxis.number_plate', 'number_plate', 'COLUMN';


 ALTER TABLE users
DROP COLUMN driver_driver_id;

UPDATE ratings
SET customer_Name = 'Sonica Shetty' 
WHERE 1=1;

update bookings
set status='Completed'
where booking_id=373

UPDATE taxis
SET availability = 0
WHERE taxi_id=4

select * from bookings where booking_id=287
select * from bookings where dropoff_location='Pune, Maharashtra, India'


 delete from drivers where user_id>11
 delete from users where user_id=26
 delete from taxis where taxi_id =4
 delete from users
 delete from taxis
 delete from bookings where booking_id%2=0
 delete from payments where booking_id%2=0

-- INSERT INTO Rides (pickup_location, drop_location, distance_in_km)
--VALUES 
--('Koramangala', 'MG Road', 5.0),
--('Koramangala', 'Indiranagar', 6.5),
--('Koramangala', 'Whitefield', 15.0),
--('Koramangala', 'Electronic City', 12.0),
--('Koramangala', 'Rajajinagar', 10.0),
--('Koramangala', 'Jayanagar', 4.5),

--('MG Road', 'Koramangala', 5.0),
--('MG Road', 'Indiranagar', 4.0),
--('MG Road', 'Whitefield', 18.0),
--('MG Road', 'Electronic City', 15.5),
--('MG Road', 'Rajajinagar', 8.0),
--('MG Road', 'Jayanagar', 6.0),

--('Indiranagar', 'Koramangala', 6.5),
--('Indiranagar', 'MG Road', 4.0),
--('Indiranagar', 'Whitefield', 12.0),
--('Indiranagar', 'Electronic City', 14.0),
--('Indiranagar', 'Rajajinagar', 10.5),
--('Indiranagar', 'Jayanagar', 7.5),

--('Whitefield', 'Koramangala', 15.0),
--('Whitefield', 'MG Road', 18.0),
--('Whitefield', 'Indiranagar', 12.0),
--('Whitefield', 'Electronic City', 20.0),
--('Whitefield', 'Rajajinagar', 22.0),
--('Whitefield', 'Jayanagar', 17.0),

--('Electronic City', 'Koramangala', 12.0),
--('Electronic City', 'MG Road', 15.5),
--('Electronic City', 'Indiranagar', 14.0),
--('Electronic City', 'Whitefield', 20.0),
--('Electronic City', 'Rajajinagar', 25.0),
--('Electronic City', 'Jayanagar', 14.5),

--('Rajajinagar', 'Koramangala', 10.0),
--('Rajajinagar', 'MG Road', 8.0),
--('Rajajinagar', 'Indiranagar', 10.5),
--('Rajajinagar', 'Whitefield', 22.0),
--('Rajajinagar', 'Electronic City', 25.0),
--('Rajajinagar', 'Jayanagar', 5.5),

--('Jayanagar', 'Koramangala', 4.5),
--('Jayanagar', 'MG Road', 6.0),
--('Jayanagar', 'Indiranagar', 7.5),
--('Jayanagar', 'Whitefield', 17.0),
--('Jayanagar', 'Electronic City', 14.5),
--('Jayanagar', 'Rajajinagar', 5.5);
