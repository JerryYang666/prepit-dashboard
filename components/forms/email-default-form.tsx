import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEmailOtp } from "@/app/api/auth/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

type UserFormValue = z.infer<typeof formSchema>;

interface EmailDefaultFormProps {
  lastUsedLoginProvider: string | null;
  setEmail: (email: string) => void;
  setEmailSignInEventId: (emailSignInEventId: string) => void;
  setEmailSignInState: (emailSignInState: number) => void;
}

export const EmailDefaultForm: React.FC<EmailDefaultFormProps> = ({
  lastUsedLoginProvider,
  setEmail,
  setEmailSignInEventId,
  setEmailSignInState,
}) => {
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const getOtp = (data: UserFormValue) => {
    getEmailOtp({ email: data.email }).then((response) => {
      setEmail(data.email);
      setEmailSignInEventId(response.event_id);
      if (response.duplicate_request) {
        toast.warning(
          "No new sign in code was sent. Your previous sign in code is still valid. Please check your email.",
        );
      } else {
        toast.success("A sign in code has been sent to your email.");
      }
      if (response.new_account) {
        setEmailSignInState(2);
      } else {
        setEmailSignInState(1);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(getOtp)} className="space-y-2 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    {...field}
                  />
                  {lastUsedLoginProvider === "email" && (
                    <Badge className="absolute -top-2 -right-2">
                      Last Used
                    </Badge>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="ml-auto w-full" type="submit">
          Get Sign In Code
        </Button>
      </form>
    </Form>
  );
};

export default EmailDefaultForm;
