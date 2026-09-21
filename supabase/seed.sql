-- Sample data for local demoing. Run after schema.sql.

insert into public.charities (name, slug, tagline, description, image_url, website, is_featured, events)
values
  (
    'Fairway Futures',
    'fairway-futures',
    'Opening golf to kids who''ve never held a club.',
    'Fairway Futures runs free junior coaching clinics in underserved communities, provides equipment scholarships, and pairs young players with mentors. Every rupee raised goes directly into clinic costs and gear.',
    null,
    'https://example.org/fairway-futures',
    true,
    '[{"name":"Junior Clinic Day","date":"2026-11-14","location":"Bengaluru"}]'
  ),
  (
    'Green Horizons Trust',
    'green-horizons-trust',
    'Restoring public parkland one course at a time.',
    'Green Horizons partners with municipal courses to convert unused acreage into native-species habitat corridors, cutting water use while keeping courses playable.',
    null,
    'https://example.org/green-horizons',
    true,
    '[]'
  ),
  (
    'Caddie Forward',
    'caddie-forward',
    'Scholarships and job training for caddies and their families.',
    'Caddie Forward funds tuition and vocational training for the families of golf-course caddies, many of whom have supported the sport for generations without benefiting from it.',
    null,
    'https://example.org/caddie-forward',
    false,
    '[{"name":"Charity Pro-Am","date":"2026-12-05","location":"Pune"}]'
  ),
  (
    'Second Swing Veterans',
    'second-swing-veterans',
    'Golf-based rehabilitation programs for injured veterans.',
    'Second Swing runs adaptive golf clinics as part of physical and mental health rehabilitation programs for military veterans.',
    null,
    'https://example.org/second-swing',
    false,
    '[]'
  );

-- To make an existing signed-up user an admin, run (after they've signed up once):
--   update public.profiles set role = 'admin' where id = '<their-auth-user-uuid>';
-- Find the uuid under Supabase Dashboard -> Authentication -> Users.
