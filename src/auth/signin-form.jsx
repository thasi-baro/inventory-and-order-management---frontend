import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

//Ràng buộc nhập
const signInSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu có ít nhất 6 ký tự"),
});

export function SignInForm({ className, ...props }) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isEditting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data; //lấy inputs

    const result = await signIn(email, password); //truyền qua hàm sign up đưa dữ liệu xuống backend

    // Chỉ navigate nếu đăng nhập thành công
    if (result?.success) {
      navigate("/"); //chuyển sang trang home
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border border-border rounded-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Đăng nhập</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Nhập email của bạn bên dưới để đăng nhập
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-xs">
                    {errors.email.message}
                  </p>
                )}
                <FieldDescription>
                  Mỗi tài khoản chỉ được dùng một email duy nhất
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Mật khẩu</FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-destructive text-xs">
                    {errors.password.message}
                  </p>
                )}
                <FieldDescription>Nhập ít nhất 6 ký tự.</FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Đăng nhập</Button>
              </Field>
              <FieldDescription className="text-center">
                Chưa có tài khoản? <a href="/sign-up"> Đăng ký</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
