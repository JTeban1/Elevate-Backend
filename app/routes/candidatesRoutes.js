const router = Router();

router.get('/', candidatesController.getAllCandidates);

router.get('/', candidatesController.getAllCandidatesByFilters);