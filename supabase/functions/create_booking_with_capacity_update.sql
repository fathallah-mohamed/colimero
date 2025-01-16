CREATE OR REPLACE FUNCTION public.create_booking_with_capacity_update(
  p_tour_id integer,
  p_user_id uuid,
  p_weight numeric,
  p_pickup_city text,
  p_delivery_city text,
  p_recipient_name text,
  p_recipient_address text,
  p_recipient_phone text,
  p_sender_name text,
  p_sender_phone text,
  p_item_type text,
  p_special_items jsonb,
  p_content_types text[],
  p_photos text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_booking_id uuid;
  v_remaining_capacity numeric;
  v_departure_country text;
  v_destination_country text;
  v_timestamp text;
BEGIN
  -- Check remaining capacity
  SELECT remaining_capacity, departure_country, destination_country 
  INTO v_remaining_capacity, v_departure_country, v_destination_country
  FROM tours
  WHERE id = p_tour_id
  FOR UPDATE;

  IF v_remaining_capacity < p_weight THEN
    RAISE EXCEPTION 'Insufficient capacity';
  END IF;

  -- Generate timestamp for tracking number
  v_timestamp := SUBSTRING(EXTRACT(EPOCH FROM NOW())::text, 1, 10);
  
  -- Generate booking ID
  v_booking_id := gen_random_uuid();

  -- Create booking with new tracking number format
  INSERT INTO bookings (
    id,
    tour_id,
    user_id,
    weight,
    pickup_city,
    delivery_city,
    recipient_name,
    recipient_address,
    recipient_phone,
    sender_name,
    sender_phone,
    item_type,
    special_items,
    content_types,
    photos,
    tracking_number,
    terms_accepted,
    customs_declaration
  ) VALUES (
    v_booking_id,
    p_tour_id,
    p_user_id,
    p_weight,
    p_pickup_city,
    p_delivery_city,
    p_recipient_name,
    p_recipient_address,
    p_recipient_phone,
    p_sender_name,
    p_sender_phone,
    p_item_type,
    p_special_items,
    p_content_types,
    p_photos,
    'RSV-' || v_departure_country || v_destination_country || '-' || v_timestamp || '-' || SUBSTRING(v_booking_id::text, 1, 8),
    true,
    true
  );

  -- Update tour capacity
  UPDATE tours
  SET remaining_capacity = remaining_capacity - p_weight
  WHERE id = p_tour_id;

  RETURN v_booking_id;
END;
$$;