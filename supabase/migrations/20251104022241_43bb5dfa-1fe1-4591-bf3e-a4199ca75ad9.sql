-- Create storage buckets for uploads and reports
insert into storage.buckets (id, name, public)
values 
  ('uploads', 'uploads', false),
  ('reports', 'reports', false)
on conflict (id) do nothing;

-- RLS policies for storage
create policy "Users can upload their own files"
on storage.objects for insert
with check (
  bucket_id = 'uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view their own uploads"
on storage.objects for select
using (
  bucket_id = 'uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own uploads"
on storage.objects for delete
using (
  bucket_id = 'uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view their own reports"
on storage.objects for select
using (
  bucket_id = 'reports' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

create policy "System can create reports"
on storage.objects for insert
with check (bucket_id = 'reports');