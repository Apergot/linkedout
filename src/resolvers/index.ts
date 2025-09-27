// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
import {Resolvers} from "../__generated__/resolvers-types";
import Query from "./queries";
import Mutation from "./mutations"

const resolvers: Resolvers = { Query, Mutation };

export default resolvers;
