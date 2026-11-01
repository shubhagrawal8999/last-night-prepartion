# Wave Optics: Unit 1

> This unit focuses on interference, thin-film optics, anti-reflection coatings, and polarization. It is meant for quick revision before an exam.

## Pass-Fast Summary

- Light waves can interfere when they have the same frequency and a stable phase relation.
- Constructive interference occurs when the waves are in phase: $\Delta = n\lambda$.
- Destructive interference occurs when the waves are out of phase: $\Delta = (2m+1)\frac{\lambda}{2}$.
- In thin films, reflected rays interfere because of both geometrical path difference and a $\frac{\lambda}{2}$ phase change on reflection.
- The reflected-system condition is: $2\mu t\cos r + \frac{\lambda}{2} = m\lambda$.
- For a wedge film, the fringe width is $\beta = \frac{\lambda}{2\mu\sin\alpha}$, or $\beta = \frac{\lambda}{2\alpha}$ for air when $\alpha$ is small.
- For anti-reflection coating, the required thickness is $t = \frac{\lambda}{4\mu_f}$.
- Polarization restricts vibrations to one plane; Malus's law is $I = I_0\cos^2\theta$.

## Revision Notes

### 1. Interference

Interference is the superposition of two or more light waves at a point. The resulting amplitude depends on the phase difference between the waves.

When two waves meet in phase, the crest of one coincides with the crest of the other, and the troughs align as well. This produces constructive interference or maxima.

The condition for constructive interference is:

$$
\Delta = n\lambda, \quad n = 0,1,2,\dots
$$

where $\Delta$ is the path difference and $\lambda$ is the wavelength.

For constructive interference in terms of phase difference $\phi$:

$$
\phi = 0, 2\pi, 4\pi, \dots = 2n\pi
$$

When two waves meet out of phase, the crest of one meets the trough of the other. This produces destructive interference or minima.

The condition for destructive interference is:

$$
\Delta = (2m+1)\frac{\lambda}{2}, \quad m = 0,1,2,\dots
$$

and in phase form:

$$
\phi = \pi, 3\pi, 5\pi, \dots = (2m+1)\pi
$$

### 2. Thin-film interference in reflected light

A thin film has two surfaces. A partially reflected ray from the top surface interferes with a ray reflected from the bottom surface after it has passed through the film.

For a transparent film of thickness $t$ and refractive index $\mu$, the geometrical path difference is:

$$
\Delta_{\text{geom}} = 2\mu t\cos r
$$

where $r$ is the angle of refraction in the film.

Because reflection from the top surface occurs at an air-to-film boundary, there is a phase change of $\pi$, equivalent to an additional path difference of $\frac{\lambda}{2}$.

Hence the total optical path difference in reflected light is:

$$
\Delta = 2\mu t\cos r + \frac{\lambda}{2}
$$

For maxima (bright fringes):

$$
2\mu t\cos r = (2n\pm 1)\frac{\lambda}{2}
$$

For minima (dark fringes):

$$
2\mu t\cos r = n\lambda
$$

This is the key formula set for thin-film interference.

### 3. Wedge-shaped film

A wedge-shaped film is formed between two surfaces inclined at a small angle $\alpha$. The film thickness varies linearly from zero at one end to a larger value at the other end.

The optical path difference becomes:

$$
\Delta = 2\mu t\cos(r+\alpha)
$$

The fringe width is the distance between two consecutive bright or dark fringes.

$$
\beta = \frac{\lambda}{2\mu\sin\alpha}
$$

For an air wedge, $\mu=1$, and for very small $\alpha$:

$$
\beta \approx \frac{\lambda}{2\alpha}
$$

where $\alpha$ is in radians.

### 4. Anti-reflection coating (ARC)

An anti-reflection coating is a thin transparent film added to lenses to reduce unwanted reflection and increase transmission.

The coating is designed so the reflected rays interfere destructively.

For normal incidence:

$$
2\mu_f t = (2m+1)\frac{\lambda}{2}
$$

For the minimum thickness, set $m=0$:

$$
2\mu_f t = \frac{\lambda}{2}
\Rightarrow
t = \frac{\lambda}{4\mu_f}
$$

This is called a quarter-wave coating. The refractive index of the film should satisfy:

$$
\mu_a < \mu_f < \mu_g
$$

where $\mu_a$ is air, $\mu_f$ is the film index, and $\mu_g$ is glass.

Magnesium fluoride, $MgF_2$ ($\mu\approx 1.38$), is commonly used because it adheres well, is durable, and is resistant to common solvents.

### 5. Testing optical flatness

An air wedge can be formed between a test glass plate and an optically flat reference plate. When monochromatic light is used, the fringe pattern reveals the surface quality.

- Straight, equally spaced fringes: the surface is optically flat.
- Curved or irregular fringes: the surface has imperfections or curvature.

This technique is used to inspect polished optics.

### 6. Polarization

Polarization is the restriction of light vibrations to a single plane. Ordinary sunlight and bulb light are unpolarized, because the electric field vibrates in all transverse directions.

The important definitions are:

- Plane of vibration: the plane containing the electric field vector and the direction of propagation.
- Plane of polarization: the plane perpendicular to the plane of vibration.

#### Types of polarized light

1. Plane polarized light (PPL): vibration is confined to one direction.
2. Circularly polarized light (CPL): two perpendicular waves of equal amplitude differ in phase by $\pi/2$.
3. Elliptically polarized light (EPL): two perpendicular waves of unequal amplitude have a phase difference not equal to $0$, $\pi/2$, or $\pi$.

### 7. Malus's law

When polarized light passes through an analyzer, the transmitted intensity depends on the angle $\theta$ between the transmission axes.

$$
I = I_0\cos^2\theta
$$

The amplitude relation is:

$$
E = E_0\cos\theta
$$

This law is central to many polarizer and analyzer problems.

### 8. Double refraction

In anisotropic crystals such as calcite or quartz, an incident unpolarized ray splits into two plane-polarized rays:

- ordinary ray (O-ray)
- extraordinary ray (E-ray)

The two beams vibrate in mutually perpendicular planes.

Double refraction is an important concept in crystal optics and polarization-based instruments.

### Exam-ready takeaways

- Interference is phase-driven: same phase gives bright fringes, opposite phase gives dark fringes.
- Thin-film problems are solved using a path difference plus the $\lambda/2$ reflection shift.
- ARC is designed around destructive interference at quarter-wave thickness.
- Polarization and Malus's law are standard theory and derivation questions.
