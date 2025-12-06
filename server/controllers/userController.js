const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { setUser } = require('../middlewares/checkAuth');


exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

      
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();

       
        const token = await setUser({ _id: user._id, email: user.email ,username:user.username });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
     
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
      
        const token = await setUser({ _id: user._id, email: user.email ,username:user.username });
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
