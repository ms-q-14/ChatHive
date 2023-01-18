import { CreateUsernameData, CreateUsernameVariables } from "@/util/types";
import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Center,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { toast } from "react-hot-toast";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState("");
  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success("Username successfully created!");

      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.log("onSubmit error", error);
    }
  };

  return (
    <Center height="100vh">
      <Stack spacing={"8"}>
        {session ? (
          <>
            <Box alignSelf="center">
              <img
                width="150px"
                src="https://preview.redd.it/2cjc4dqgp1381.png?auto=webp&s=11a5b9069a7dce00f28ba55fe1aab81578e0015a"
              />
            </Box>
            <Text fontSize={"3xl"} align={"center"}>
              Create a Username
            </Text>
            <Input
              placeholder="Enter a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Button width={"100%"} onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Box alignSelf="center">
              <img
                width="150px"
                src="https://preview.redd.it/2cjc4dqgp1381.png?auto=webp&s=11a5b9069a7dce00f28ba55fe1aab81578e0015a"
              />
            </Box>
            <Text align="center" fontSize="3xl">
              ChatHive
            </Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={
                <Image
                  height="20px"
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                ></Image>
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
