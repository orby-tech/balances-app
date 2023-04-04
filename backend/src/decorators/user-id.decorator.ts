import { createParamDecorator } from "@nestjs/common";

export const UserId = createParamDecorator((data, req): string => {
    const userId =
      req.contextType === 'graphql' ? req.args[2].req.user.sub : req.user.sub;
  
    if (!userId) {
      throw new Error(`User not found in userId decorator`);
    }
    return userId;
  });