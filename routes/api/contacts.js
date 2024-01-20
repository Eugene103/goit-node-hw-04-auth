import  express  from "express"
import contactsController from "../../controllers/contacts-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js"
import isCheckId from "../../middlewares/isCheckId.js"
import isEmptyFavorite from "../../middlewares/isEmpyFavorite.js"
import isCheckHeaders from "../../middlewares/isCheckHeaders.js";

const contactsRouter = express.Router();

contactsRouter.use(isCheckHeaders)

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', isCheckId,  contactsController.getContact)

contactsRouter.post('/', isEmptyBody,  contactsController.add)

contactsRouter.delete('/:contactId', isCheckId,  contactsController.remove)

contactsRouter.put('/:contactId', isEmptyBody, isCheckId,  contactsController.updateStatusContact)

contactsRouter.patch('/:contactId/favorite', isEmptyFavorite, isCheckId,  contactsController.updateStatusContact)

export default contactsRouter
