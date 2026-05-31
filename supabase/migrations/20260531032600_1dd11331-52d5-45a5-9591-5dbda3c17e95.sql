
-- Seed modules
INSERT INTO public.modules (title, order_index, description, hours) VALUES
('Fundamentos do Envelhecimento e da Pessoa Idosa', 1, 'Compreensão do processo de envelhecimento humano, aspectos biopsicossociais e a centralidade da pessoa idosa.', 22),
('O Cuidador e o Cuidar', 2, 'A identidade do cuidador profissional, ética, postura e os princípios do cuidar humanizado.', 22),
('Fisiologia do Envelhecimento', 3, 'Alterações fisiológicas dos sistemas corporais e suas implicações no cuidado diário.', 22),
('Demências e Condições Neurológicas', 4, 'Alzheimer, Parkinson e outras condições — comunicação, manejo e cuidado especializado.', 22),
('Rotina Assistencial no Domicílio', 5, 'Organização da rotina, higiene, conforto, mobilização e segurança no ambiente domiciliar.', 24),
('Alimentação, Hidratação e Saúde do Idoso', 6, 'Nutrição adequada, hidratação, disfagia e suporte alimentar especializado.', 22),
('Cuidados com Dispositivos no Domicílio', 7, 'Manejo de sondas, cateteres, oxigenoterapia e dispositivos de cuidado contínuo.', 22),
('Primeiros Socorros e Intercorrências', 8, 'Conduta em emergências, sinais de alerta e procedimentos seguros até atendimento especializado.', 24)
ON CONFLICT DO NOTHING;

-- Update handle_new_user trigger to grant admin role to academy@aegiscare.com.br
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone, city, state, access_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    CASE WHEN NEW.email = 'academy@aegiscare.com.br' THEN 'active'::access_status ELSE 'pending'::access_status END
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email = 'academy@aegiscare.com.br' THEN 'admin'::app_role ELSE 'student'::app_role END
  );
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
DROP TRIGGER IF EXISTS profiles_updated ON public.profiles;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS modules_updated ON public.modules;
CREATE TRIGGER modules_updated BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS lessons_updated ON public.lessons;
CREATE TRIGGER lessons_updated BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS forum_updated ON public.forum_posts;
CREATE TRIGGER forum_updated BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin can manage profiles (approve students)
DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can manage user_roles
DROP POLICY IF EXISTS "Admin manage user_roles" ON public.user_roles;
CREATE POLICY "Admin manage user_roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
